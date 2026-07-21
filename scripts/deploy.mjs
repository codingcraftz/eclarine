// pnpm run deploy: 이미지를 서버 아키텍처(amd64)로 빌드해 hetzner로 보내고 web을 재기동한다.
// 로컬이 Apple Silicon이라 --platform 을 빼면 서버에서 exec format error 가 난다.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const HOST = 'hetzner';
const IMAGE = 'eclarine-web:latest';
const REMOTE_DIR = '/opt/eclarine';
const SITE_URL = 'https://eclarine.kr';
// 컨테이너에 직접 물어본다 — 로컬 DNS 캐시나 Caddy 상태에 흔들리지 않는다
const HEALTH_CMD = 'curl -fsS -o /dev/null -w %{http_code} http://127.0.0.1:3020/api/health';

// NEXT_PUBLIC_* 와 S3_PUBLIC_URL 은 빌드 시점에 번들에 박히므로 .env.server 에서 읽어 넘긴다
const BUILD_ARGS = ['NEXT_PUBLIC_TOSS_CLIENT_KEY', 'S3_PUBLIC_URL'];

function readEnvServer() {
  const env = {};
  for (const line of readFileSync('.env.server', 'utf8').split('\n')) {
    const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line.trim());
    if (m) env[m[1]] = m[2];
  }
  return env;
}

function run(label, cmd, args, opts = {}) {
  console.log(`\n↳ ${label}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) {
    console.error(`\n✗ ${label} 실패`);
    process.exit(r.status ?? 1);
  }
}

const env = readEnvServer();
const missing = BUILD_ARGS.filter((k) => !env[k]);
if (missing.length) {
  console.error(`✗ .env.server 에 ${missing.join(', ')} 가 없습니다.`);
  process.exit(1);
}

run('amd64 이미지 빌드', 'docker', [
  'build',
  '--platform',
  'linux/amd64',
  '-f',
  'docker/Dockerfile',
  ...BUILD_ARGS.flatMap((k) => ['--build-arg', `${k}=${env[k]}`]),
  '-t',
  IMAGE,
  '.',
]);

run('서버로 이미지 전송', 'sh', [
  '-c',
  `docker save ${IMAGE} | gzip -1 | ssh ${HOST} 'gunzip | docker load'`,
]);

run('web 재기동', 'ssh', [HOST, `cd ${REMOTE_DIR} && docker compose up -d web`]);

// 컨테이너가 뜬 뒤 DB·스토리지까지 닿는지 확인 — 이미지가 깨졌으면 여기서 잡힌다
console.log('\n↳ 헬스체크');
for (let i = 1; i <= 10; i++) {
  const r = spawnSync('ssh', [HOST, HEALTH_CMD], { encoding: 'utf8' });
  if (r.stdout?.trim() === '200') {
    console.log(`\n✓ 배포 완료 — ${SITE_URL}`);
    process.exit(0);
  }
  process.stdout.write('.');
  spawnSync('sleep', ['2']);
}

console.error('\n✗ 헬스체크 실패. `ssh hetzner docker logs eclarine_web --tail 50` 으로 확인하세요.');
process.exit(1);
