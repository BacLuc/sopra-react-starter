/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.birthday = null;
    this.logged_in = false;
    this.creation_date = null;
    Object.assign(this, data);
  }
}
export default User;
