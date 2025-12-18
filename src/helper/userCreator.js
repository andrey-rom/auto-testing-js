import Fakerator from 'fakerator';
import Randomizer from '../utils/Randomizer.js';

const fakerator = Fakerator();

export default class UserCreator {
  // Available subjects for the form
  static SUBJECTS = ['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Arts'];
  
  // Available genders
  static GENDERS = ['Male', 'Female', 'Other'];
  
  // Available hobbies
  static HOBBIES = ['Sports', 'Reading', 'Music'];
  
  // State and City mappings (based on demoqa.com practice form)
  static STATE_CITY_MAP = {
    'NCR': ['Delhi', 'Gurgaon', 'Noida'],
    'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
    'Haryana': ['Karnal', 'Panipat'],
    'Rajasthan': ['Jaipur', 'Jaiselmer'],
  };

  static createUser() {
    const firstName = fakerator.names.firstName();
    const lastName = fakerator.names.lastName();
    
    // Generate random date of birth (between 18-65 years old)
    const minAge = 18;
    const maxAge = 65;
    const birthYear = new Date().getFullYear() - Math.floor(Math.random() * (maxAge - minAge + 1) + minAge);
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Use 28 to avoid month-specific issues
    const dateOfBirth = new Date(birthYear, birthMonth - 1, birthDay);
    
    // Format date as "DD MMM YYYY" (e.g., "15 May 1990")
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${birthDay} ${months[birthMonth - 1]} ${birthYear}`;
    
    // Format date for verification (e.g., "15 May,1990")
    const formattedDateForVerification = `${birthDay} ${months[birthMonth - 1]},${birthYear}`;
    
    // Generate mobile number (10 digits)
    const mobile = fakerator.phone.number().replace(/\D/g, '').slice(0, 10);
    // Ensure it's exactly 10 digits
    const mobileNumber = mobile.length === 10 ? mobile : '1' + mobile.padStart(9, '0').slice(0, 9);
    
    // Select random subject
    const subject = Randomizer.randomValueFromArray(this.SUBJECTS);
    
    // Select random gender
    const gender = Randomizer.randomValueFromArray(this.GENDERS);
    
    // Select random hobbies (1-3 hobbies)
    const numHobbies = Math.floor(Math.random() * 3) + 1;
    const shuffledHobbies = [...this.HOBBIES].sort(() => Math.random() - 0.5);
    const selectedHobbies = shuffledHobbies.slice(0, numHobbies);
    
    // Select random state and corresponding city
    const states = Object.keys(this.STATE_CITY_MAP);
    const state = Randomizer.randomValueFromArray(states);
    const cities = this.STATE_CITY_MAP[state];
    const city = Randomizer.randomValueFromArray(cities);

    return {
      firstName: firstName,
      lastName: lastName,
      fullName: `${firstName} ${lastName}`,
      email: fakerator.internet.email(),
      mobile: mobileNumber,
      dateOfBirth: formattedDate,
      dateOfBirthForVerification: formattedDateForVerification,
      subject: subject,
      gender: gender,
      hobbies: selectedHobbies,
      state: state,
      city: city,
      address: `${fakerator.address.country()}, ${fakerator.address.city()}, ${fakerator.address.countryCode()}`,
      addressAnother: `${fakerator.address.country()}, ${fakerator.address.city()}, ${fakerator.address.countryCode()}`,
    };
  }
}
