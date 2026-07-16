// pnpm run dev: 서버 DB/MinIO로 가는 SSH 터널을 먼저 띄우고 next dev 실행.
// 터널이 이미 열려 있으면 그대로 재사용한다. /shop·/form 이 서버 Postgres·MinIO에
// 붙어야 하므로 (5442→Postgres, 9200→MinIO) 매번 손으로 터널 여는 수고를 없앤다.
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';

const HOST = 'hetzner';
const PORTS = [
  { local: 5442, label: 'Postgres' },
  { local: 9200, label: 'MinIO' },
];

function isOpen(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ host: '127.0.0.1', port }, () => {
      sock.end();
      resolve(true);
    });
    sock.on('error', () => resolve(false));
    sock.setTimeout(800, () => {
      sock.destroy();
      resolve(false);
    });
  });
}

if (await isOpen(PORTS[0].local)) {
  console.log(`↳ SSH 터널 이미 열림 (${PORTS.map((p) => p.local).join(', ')})`);
} else {
  console.log(`↳ ${HOST} 로 SSH 터널 여는 중 (${PORTS.map((p) => `${p.local}:${p.label}`).join(', ')})…`);
  const args = ['-f', '-N'];
  for (const p of PORTS) args.push('-L', `${p.local}:localhost:${p.local}`);
  args.push(HOST);
  const r = spawnSync('ssh', args, { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n✗ 터널 실패. \`ssh ${HOST}\` 키 인증이 되는지 확인하세요.`);
    console.error('  (랜딩 / 은 터널 없이도 뜨지만 /shop·/form 은 서버 DB가 필요합니다.)');
    process.exit(1);
  }
}

// pnpm 스크립트 컨텍스트라 node_modules/.bin 이 PATH에 있어 next 를 바로 찾는다
const child = spawn('next', ['dev'], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
