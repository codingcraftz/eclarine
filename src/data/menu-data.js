import home_1 from "@assets/img/menu/menu-home-1.jpg";
import home_2 from "@assets/img/menu/menu-home-2.jpg";
import home_3 from "@assets/img/menu/menu-home-3.jpg";
import home_4 from "@assets/img/menu/menu-home-4.jpg";

const menu_data = [
  {
    id: 1,
    single_link: true,
    title: "홈",
    link: "/",
  },
  {
    id: 2,
    sub_menu: true,
    title: "카테고리",
    link: "/shop",
    sub_menus: [
      { title: "실버 (Silver)", link: "/shop?category=silver" },
      { title: "써지컬 스틸 (Surgical)", link: "/shop?category=surgical" },
      { title: "골드 (Gold)", link: "/shop?category=gold" },
      { title: "티타늄 (Titanium)", link: "/shop?category=titanium" },
      { title: "피어싱 (Piercing)", link: "/shop?category=piercing" },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: "제품",
    link: "/shop",
    sub_menus: [
      { title: "목걸이", link: "/shop?type=necklace" },
      { title: "팔찌", link: "/shop?type=bracelet" },
      { title: "반지", link: "/shop?type=ring" },
      { title: "귀걸이", link: "/shop?type=earring" },
      { title: "피어싱", link: "/shop?type=piercing" },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: "전체상품",
    link: "/shop",
  },
  {
    id: 5,
    single_link: true,
    title: "고객센터",
    link: "/contact",
  },
];

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    single_link: true,
    title: "홈",
    link: "/",
  },
  {
    id: 2,
    sub_menu: true,
    title: "카테고리",
    link: "/shop",
    sub_menus: [
      { title: "실버 (Silver)", link: "/shop?category=silver" },
      { title: "써지컬 스틸 (Surgical)", link: "/shop?category=surgical" },
      { title: "골드 (Gold)", link: "/shop?category=gold" },
      { title: "티타늄 (Titanium)", link: "/shop?category=titanium" },
      { title: "피어싱 (Piercing)", link: "/shop?category=piercing" },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: "제품",
    link: "/shop",
    sub_menus: [
      { title: "목걸이", link: "/shop?type=necklace" },
      { title: "팔찌", link: "/shop?type=bracelet" },
      { title: "반지", link: "/shop?type=ring" },
      { title: "귀걸이", link: "/shop?type=earring" },
      { title: "피어싱", link: "/shop?type=piercing" },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: "전체상품",
    link: "/shop",
  },
  {
    id: 5,
    single_link: true,
    title: "고객센터",
    link: "/contact",
  },
];
