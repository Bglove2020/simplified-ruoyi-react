/**
 * 基础树节点类型
 * 用于通用的树形结构组件
 */
export type TreeNode = {
  publicId: string;
  name: string;
  children?: TreeNode[];
};

/**
 * 部门节点类型
 * 扩展了基础树节点，包含部门相关的所有字段
 */
export type DeptNode = TreeNode & {
  sortOrder: number;
  leaderPublicId?: string;
  leaderName?: string;
  leaderEmail?: string;
  status: string;
  children: DeptNode[];
};

/**
 * 部门节点类型
 * 扩展了基础树节点，包含部门相关的所有字段
 */
export type MenuNode = TreeNode & {
  sortOrder: number;
  path: string | undefined;
  perms: string | undefined;
  isFrame: "0" | "1";
  menuType: "M" | "C" | "F";
  visible: "0" | "1";
  status: "0" | "1";
  children: MenuNode[];
};

