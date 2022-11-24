import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { myUpdateQueryHelper } from "./myUpdateQueryHelper";
import { pipe, tap } from "wonka";
import Router from "next/router";
import { gql } from "@urql/core";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("Not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }
    const fieldKey = `${fieldName})(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(entityKey, fieldKey);
    info.partial = !isInCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fInfo) => {
      const key = cache.resolve(entityKey, fInfo.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };

    //     const visited = new Set();
    //     let result: NullArray<string> = [];
    //     let prevOffset: number | null = null;

    //     for (let i = 0; i < size; i++) {
    //       const { fieldKey, arguments: args } = fieldInfos[i];
    //       if (args === null || !compareArgs(fieldArgs, args)) {
    //         continue;
    //       }

    //       const links = cache.resolve(entityKey, fieldKey) as string[];
    //       const currentOffset = args[offsetArgument];

    //       if (
    //         links === null ||
    //         links.length === 0 ||
    //         typeof currentOffset !== "number"
    //       ) {
    //         continue;
    //       }

    //       const tempResult: NullArray<string> = [];

    //       for (let j = 0; j < links.length; j++) {
    //         const link = links[j];
    //         if (visited.has(link)) continue;
    //         tempResult.push(link);
    //         visited.add(link);
    //       }

    //       if (
    //         (!prevOffset || currentOffset > prevOffset) ===
    //         (mergeMode === "after")
    //       ) {
    //         result = [...result, ...tempResult];
    //       } else {
    //         result = [...tempResult, ...result];
    //       }

    //       prevOffset = currentOffset;
    //     }

    //     const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    //     if (hasCurrentPage) {
    //       return result;
    //     } else if (!(info as any).store.schema) {
    //       return undefined;
    //     } else {
    //       info.partial = true;
    //       return result;
    //     }
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          deletePost: (_result, args, cache, info) => {
            cache.invalidate({
              __typename: "Post",
              id: (args as DeletePostMutationVariables).id,
            });
          },
          vote: (_result, args, cache, info) => {
            const { postId, value } = args as VoteMutationVariables;
            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                }
              `,
              { id: postId }
            );
            if (data) {
              const newPoints = data.points + value;
              cache.writeFragment(
                gql`
                  fragment _ on Post {
                    points
                  }
                `,
                { id: postId, points: newPoints }
              );
            }
          },
          logout: (_result, args, cache, info) => {
            myUpdateQueryHelper<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            myUpdateQueryHelper<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            myUpdateQueryHelper<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),

    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
