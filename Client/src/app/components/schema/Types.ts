//LANDING PAGE
export type CounterProps = {
  target: number;
  className: string;
};

// AUTH
export type SigupProp = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type authProp = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type resetPasswordProp = {
  params: {
    email: string;
  };
};

export type newPasswordProp = {
  params: {
    userId: string;
    token: string;
  };
};

export interface ErrorProp {
  response: {
    data: {
      error: string;
      message: string;
    };
  };
}

//DASHBOARD
export interface FileObject {
  name: string;
  lastModified: number;
  lastModifiedDate?: Date;
  webkitRelativePath: string;
  size: number;
  type: string;
}

//COLUMNS
export type Category = {
  original: any;
  _id: string;
  select: string;
  id: string;
  name: string;
};

export type Course = {
  completed: boolean;
  _id: string;
  category: string;
  title: string;
  description: string;
  videoUrl: string;
  price: number;
  duration: string;
  rating: number;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  difficulty: string;
  username: string;
};
export type PaystackProp = {
  title: string;
  amount: number;
  duration: number;
};

export type Video = {
  _id: string;
  category: string;
  title: string;
  description: string;
  videoUrl: string;
  price: number;
  duration: string;
  rating: number;
  free: boolean;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  difficulty: string;
  username: string;
};

export type Support = {
  id: string;
  subject: string;
  email: string;
  createdAt: string;
  status: "Open" | "Resolved";
};

export type Leaderboard = {
  rank: number;
  name: any;
  courses: number;
  hour: number;
  point: number;
};
