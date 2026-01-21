export default class RandomCredentials {
  static generateUsername() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `User_${timestamp}_${randomNum}`;
  }

  static generatePassword(length = 12) {
    if (length < 8) length = 8;
    
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = '';
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    
    for (let i = password.length; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  static generateCredentials() {
    return {
      userName: this.generateUsername(),
      password: this.generatePassword(),
    };
  }
}
