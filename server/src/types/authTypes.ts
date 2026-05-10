export interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

export interface SignInBody {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
}