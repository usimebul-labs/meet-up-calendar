import "next-auth";

/**
 * NextAuth의 기본 타입을 확장합니다.
 * 우리가 원하는 커스텀 프로퍼티를 User와 Session 인터페이스에 추가할 수 있습니다.
 */
declare module "next-auth" {
  /**
   * `session` 콜백에서 반환되는 Session 객체의 타입입니다.
   * `user` 객체에 우리가 추가한 `id` 프로퍼티를 포함하도록 확장합니다.
   */
  interface Session {
    user: {
      /** 사용자의 고유 ID */
      id: string;
      // 여기에 user 객체에 추가하고 싶은 다른 프로퍼티들을 추가할 수 있습니다.
      // 예: role: string;
    } & DefaultSession["user"]; // 기존의 name, email, image 프로퍼티를 유지합니다.
  }

  /**
   * `jwt` 콜백의 `token`이나 `user` 객체에 들어갈 타입을 정의할 수 있습니다.
   * 보통은 Session 인터페이스를 확장하는 것만으로도 충분합니다.
   */
  // interface User {
  //   // 여기에 DB 모델의 User와 일치하는 추가 필드를 넣을 수 있습니다.
  //   // 예: role: string;
  // }
}
