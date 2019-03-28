class Validate {
  static isEmpty(input){
    return(input ===undefined || input===null || (typeof input==='object' && Object.keys(input).length===0)
    || (typeof input==='string' && input.trim().length===0));
  }
  static email(input) {
    const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return input.match(email); 
  }

  static password(input) {
    return (input.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/g));
  }
}

export default Validate;
