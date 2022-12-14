import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  changePassword: UserResponse;
  createPost: Post;
  deletePost: Scalars["Boolean"];
  deleteUser: Scalars["String"];
  forgotPassword: Scalars["Boolean"];
  login: UserResponse;
  logout: Scalars["Boolean"];
  register: UserResponse;
  updatePost?: Maybe<Post>;
  updateUser: UserResponse;
  vote: Scalars["Int"];
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars["String"];
  token: Scalars["String"];
};

export type MutationCreatePostArgs = {
  pixUrl?: InputMaybe<Scalars["String"]>;
  text: Scalars["String"];
  title: Scalars["String"];
};

export type MutationDeletePostArgs = {
  id: Scalars["Int"];
};

export type MutationDeleteUserArgs = {
  id: Scalars["Float"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  usernameOrEmail: Scalars["String"];
};

export type MutationRegisterArgs = {
  inputValue: UserObjectFields;
};

export type MutationUpdatePostArgs = {
  id: Scalars["Int"];
  text?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type MutationUpdateUserArgs = {
  id: Scalars["Float"];
  inputValue: UserObjectFields;
};

export type MutationVoteArgs = {
  postId: Scalars["Int"];
  value: Scalars["Int"];
};

export type PaginatedPosts = {
  __typename?: "PaginatedPosts";
  hasMore: Scalars["Boolean"];
  posts: Array<Post>;
};

export type Post = {
  __typename?: "Post";
  created_at: Scalars["String"];
  creator: User;
  creatorId: Scalars["Float"];
  id: Scalars["Float"];
  pixUrl: Scalars["String"];
  points: Scalars["Float"];
  text: Scalars["String"];
  textSnippet: Scalars["String"];
  title: Scalars["String"];
  updated_at: Scalars["String"];
  updoots: Updoot;
  voteStatus?: Maybe<Scalars["Int"]>;
};

export type Query = {
  __typename?: "Query";
  hello: Scalars["String"];
  me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
  user?: Maybe<User>;
  userPosts: PaginatedPosts;
  users: Array<User>;
};

export type QueryPostArgs = {
  id: Scalars["Int"];
};

export type QueryPostsArgs = {
  cursor?: InputMaybe<Scalars["String"]>;
  limit: Scalars["Float"];
};

export type QueryUserArgs = {
  id: Scalars["Float"];
};

export type QueryUserPostsArgs = {
  cursor?: InputMaybe<Scalars["String"]>;
  id: Scalars["Int"];
  limit: Scalars["Float"];
};

export type Updoot = {
  __typename?: "Updoot";
  post: Post;
  postId: Scalars["Float"];
  user: User;
  userId: Scalars["Float"];
  value: Scalars["Float"];
};

export type User = {
  __typename?: "User";
  created_at: Scalars["String"];
  email: Scalars["String"];
  id: Scalars["Float"];
  updated_at: Scalars["String"];
  username: Scalars["String"];
};

export type UserObjectFields = {
  email: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type PostSnippetFragment = {
  __typename?: "Post";
  created_at: string;
  creatorId: number;
  id: number;
  points: number;
  voteStatus?: number | null;
  text: string;
  pixUrl: string;
  textSnippet: string;
  title: string;
  updated_at: string;
  creator: { __typename?: "User"; id: number; username: string };
};

export type RegularErrorFragment = {
  __typename?: "FieldError";
  field: string;
  message: string;
};

export type RegularUserFragment = {
  __typename?: "User";
  created_at: string;
  email: string;
  id: number;
  updated_at: string;
  username: string;
};

export type RegularUserResponseFragment = {
  __typename?: "UserResponse";
  errors?: Array<{
    __typename?: "FieldError";
    field: string;
    message: string;
  }> | null;
  user?: {
    __typename?: "User";
    created_at: string;
    email: string;
    id: number;
    updated_at: string;
    username: string;
  } | null;
};

export type UpdatePostFragmentFragment = {
  __typename?: "Post";
  id: number;
  text: string;
  textSnippet: string;
  title: string;
};

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars["String"];
  token: Scalars["String"];
}>;

export type ChangePasswordMutation = {
  __typename?: "Mutation";
  changePassword: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      created_at: string;
      email: string;
      id: number;
      updated_at: string;
      username: string;
    } | null;
  };
};

export type CreatePostMutationVariables = Exact<{
  text: Scalars["String"];
  title: Scalars["String"];
  pixUrl: Scalars["String"];
}>;

export type CreatePostMutation = {
  __typename?: "Mutation";
  createPost: {
    __typename?: "Post";
    created_at: string;
    creatorId: number;
    id: number;
    points: number;
    text: string;
    title: string;
    pixUrl: string;
    updated_at: string;
  };
};

export type DeletePostMutationVariables = Exact<{
  id: Scalars["Int"];
}>;

export type DeletePostMutation = {
  __typename?: "Mutation";
  deletePost: boolean;
};

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = {
  __typename?: "Mutation";
  forgotPassword: boolean;
};

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      created_at: string;
      email: string;
      id: number;
      updated_at: string;
      username: string;
    } | null;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation"; logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "UserResponse";
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      created_at: string;
      email: string;
      id: number;
      updated_at: string;
      username: string;
    } | null;
  };
};

export type UpdatePostMutationVariables = Exact<{
  id: Scalars["Int"];
  title?: InputMaybe<Scalars["String"]>;
  text?: InputMaybe<Scalars["String"]>;
}>;

export type UpdatePostMutation = {
  __typename?: "Mutation";
  updatePost?: {
    __typename?: "Post";
    id: number;
    text: string;
    textSnippet: string;
    title: string;
  } | null;
};

export type VoteMutationVariables = Exact<{
  value: Scalars["Int"];
  postId: Scalars["Int"];
}>;

export type VoteMutation = { __typename?: "Mutation"; vote: number };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    created_at: string;
    email: string;
    id: number;
    updated_at: string;
    username: string;
  } | null;
};

export type PostQueryVariables = Exact<{
  id: Scalars["Int"];
}>;

export type PostQuery = {
  __typename?: "Query";
  post?: {
    __typename?: "Post";
    id: number;
    creatorId: number;
    created_at: string;
    updated_at: string;
    text: string;
    points: number;
    title: string;
    pixUrl: string;
    voteStatus?: number | null;
    creator: { __typename?: "User"; id: number; username: string };
  } | null;
};

export type PostsQueryVariables = Exact<{
  limit: Scalars["Float"];
  cursor?: InputMaybe<Scalars["String"]>;
}>;

export type PostsQuery = {
  __typename?: "Query";
  posts: {
    __typename?: "PaginatedPosts";
    hasMore: boolean;
    posts: Array<{
      __typename?: "Post";
      created_at: string;
      creatorId: number;
      id: number;
      points: number;
      voteStatus?: number | null;
      text: string;
      pixUrl: string;
      textSnippet: string;
      title: string;
      updated_at: string;
      creator: { __typename?: "User"; id: number; username: string };
    }>;
  };
};

export type UserPostsQueryVariables = Exact<{
  limit: Scalars["Float"];
  id: Scalars["Int"];
}>;

export type UserPostsQuery = {
  __typename?: "Query";
  userPosts: {
    __typename?: "PaginatedPosts";
    hasMore: boolean;
    posts: Array<{
      __typename?: "Post";
      creatorId: number;
      id: number;
      title: string;
      text: string;
      textSnippet: string;
      creator: { __typename?: "User"; id: number; username: string };
    }>;
  };
};

export type UsersQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQuery = {
  __typename?: "Query";
  users: Array<{
    __typename?: "User";
    created_at: string;
    email: string;
    id: number;
    updated_at: string;
    username: string;
  }>;
};

export const PostSnippetFragmentDoc = gql`
  fragment PostSnippet on Post {
    created_at
    creatorId
    id
    points
    voteStatus
    text
    pixUrl
    textSnippet
    title
    updated_at
    creator {
      id
      username
    }
  }
`;
export const RegularErrorFragmentDoc = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`;
export const RegularUserFragmentDoc = gql`
  fragment RegularUser on User {
    created_at
    email
    id
    updated_at
    username
  }
`;
export const RegularUserResponseFragmentDoc = gql`
  fragment RegularUserResponse on UserResponse {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;
export const UpdatePostFragmentFragmentDoc = gql`
  fragment UpdatePostFragment on Post {
    id
    text
    textSnippet
    title
  }
`;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($newPassword: String!, $token: String!) {
    changePassword(newPassword: $newPassword, token: $token) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const CreatePostDocument = gql`
  mutation CreatePost($text: String!, $title: String!, $pixUrl: String!) {
    createPost(text: $text, title: $title, pixUrl: $pixUrl) {
      created_at
      creatorId
      id
      points
      text
      title
      pixUrl
      updated_at
    }
  }
`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument
  );
}
export const DeletePostDocument = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(
    DeletePostDocument
  );
}
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(password: $password, usernameOrEmail: $usernameOrEmail) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
export const RegisterDocument = gql`
  mutation Register($username: String!, $password: String!, $email: String!) {
    register(
      inputValue: { password: $password, email: $email, username: $username }
    ) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
export const UpdatePostDocument = gql`
  mutation UpdatePost($id: Int!, $title: String, $text: String) {
    updatePost(id: $id, title: $title, text: $text) {
      ...UpdatePostFragment
    }
  }
  ${UpdatePostFragmentFragmentDoc}
`;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(
    UpdatePostDocument
  );
}
export const VoteDocument = gql`
  mutation Vote($value: Int!, $postId: Int!) {
    vote(value: $value, postId: $postId)
  }
`;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
}
export const MeDocument = gql`
  query Me {
    me {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`;

export function useMeQuery(
  options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query">
) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({
    query: MeDocument,
    ...options,
  });
}
export const PostDocument = gql`
  query Post($id: Int!) {
    post(id: $id) {
      id
      creatorId
      created_at
      updated_at
      text
      points
      title
      pixUrl
      voteStatus
      creator {
        id
        username
      }
    }
  }
`;

export function usePostQuery(
  options: Omit<Urql.UseQueryArgs<PostQueryVariables>, "query">
) {
  return Urql.useQuery<PostQuery, PostQueryVariables>({
    query: PostDocument,
    ...options,
  });
}
export const PostsDocument = gql`
  query Posts($limit: Float!, $cursor: String) {
    posts(limit: $limit, cursor: $cursor) {
      hasMore
      posts {
        ...PostSnippet
      }
    }
  }
  ${PostSnippetFragmentDoc}
`;

export function usePostsQuery(
  options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, "query">
) {
  return Urql.useQuery<PostsQuery, PostsQueryVariables>({
    query: PostsDocument,
    ...options,
  });
}
export const UserPostsDocument = gql`
  query UserPosts($limit: Float!, $id: Int!) {
    userPosts(limit: $limit, id: $id) {
      hasMore
      posts {
        creatorId
        id
        title
        text
        textSnippet
        creator {
          id
          username
        }
      }
    }
  }
`;

export function useUserPostsQuery(
  options: Omit<Urql.UseQueryArgs<UserPostsQueryVariables>, "query">
) {
  return Urql.useQuery<UserPostsQuery, UserPostsQueryVariables>({
    query: UserPostsDocument,
    ...options,
  });
}
export const UsersDocument = gql`
  query Users {
    users {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`;

export function useUsersQuery(
  options?: Omit<Urql.UseQueryArgs<UsersQueryVariables>, "query">
) {
  return Urql.useQuery<UsersQuery, UsersQueryVariables>({
    query: UsersDocument,
    ...options,
  });
}
