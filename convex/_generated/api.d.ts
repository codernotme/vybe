/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as _utils from "../_utils.js";
import type * as anonymousChat from "../anonymousChat.js";
import type * as anonymousPost from "../anonymousPost.js";
import type * as conversation from "../conversation.js";
import type * as conversations from "../conversations.js";
import type * as events from "../events.js";
import type * as friend from "../friend.js";
import type * as friends from "../friends.js";
import type * as getUserPosts from "../getUserPosts.js";
import type * as github from "../github.js";
import type * as http from "../http.js";
import type * as message from "../message.js";
import type * as messages from "../messages.js";
import type * as newsletter from "../newsletter.js";
import type * as post from "../post.js";
import type * as posts from "../posts.js";
import type * as request from "../request.js";
import type * as requests from "../requests.js";
import type * as roles from "../roles.js";
import type * as user from "../user.js";
import type * as users from "../users.js";
import type * as workspace from "../workspace.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  _utils: typeof _utils;
  anonymousChat: typeof anonymousChat;
  anonymousPost: typeof anonymousPost;
  conversation: typeof conversation;
  conversations: typeof conversations;
  events: typeof events;
  friend: typeof friend;
  friends: typeof friends;
  getUserPosts: typeof getUserPosts;
  github: typeof github;
  http: typeof http;
  message: typeof message;
  messages: typeof messages;
  newsletter: typeof newsletter;
  post: typeof post;
  posts: typeof posts;
  request: typeof request;
  requests: typeof requests;
  roles: typeof roles;
  user: typeof user;
  users: typeof users;
  workspace: typeof workspace;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
