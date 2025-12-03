export type RouterItem = {
  name: string;
  path: string;
  component: string | null;
  visible: boolean;
  isFrame: boolean;
  menuType: string;
  children: RouterItem[];
};
