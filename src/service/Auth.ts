import Storage from "./Storage"

class Auth {
  static isLogin():boolean{
    const auth = Storage.getStorage('auth')
    return auth && auth.token && auth.user;
  }

  static logout():void{
    Storage.removeStorage('auth')
  }
}

export default Auth
