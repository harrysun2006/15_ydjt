(function($) {
  function checkCalorie(calorie) {
    var error = false;
    if (calorie === undefined || calorie === null) {
      error = 'Invalid calorie data!';
    } else if (calorie.date === undefined || calorie.date === null || calorie.date === '') {
      error = 'Date is missing!';
    } else if (typeof moment != undefined && !moment(calorie.date, 'DD/MM/YYYY').isValid()) {
      error = 'Date is invalid!';
    } else if (calorie.time === undefined || calorie.time === null || calorie.time === '') {
      error = 'Time is missing!';
    } else if (typeof moment != undefined && !moment(calorie.time, 'hh:mm:ss').isValid()) {
      error = 'Time is invalid!';
    } else if (calorie.description === undefined || calorie.description === null || calorie.description == '') {
      error = 'Description is blank!';
    } else if (calorie.amount === undefined || calorie.amount === null) {
      error = 'Calorie number is missing!';
    } else if (isNaN(Number(calorie.amount)) || Number(calorie.amount) <= 0) {
      error = 'Calorie number is less than or equal to 0!';
    }
    return error;
  }
  
  function checkUser(user) {
    var error = false;
    if (user === undefined || user === null) {
      error = 'Invalid user data!';
      return error;
    }
    var setting = user.setting || {};
    if (user.username === undefined || user.username === null || user.username.length < 3) {
      error = 'Username is less than 3 characters!';
    } else if (user.password != undefined && user.password != null && user.password.length < 4) {
      error = 'Current Password is less than 4 characters!';
    } else if (user.password1 === undefined || user.password1 === null || user.password1.length < 4) {
      error = 'Password is less than 4 characters!';
    } else if (user.password2 === undefined || user.password2 === null || user.password2 == '') {
      error = 'Confirmed password is blank!';
    } else if (user.password1 != user.password2) {
      error = 'Confirmed password is not same as password!';
    } else if (setting.expNumber === undefined || setting.expNumber === null) {
      error = 'Expected number for daily intaken calories is missing!';
    } else if (isNaN(Number(setting.expNumber)) || Number(setting.expNumber) <= 0) {
      error = 'Expected number for daily intaken calories is less than or equal to 0!';
    }
    return error;
  }

  $.validator = $.validator || {};
  $.extend($.validator, {
    checkCalorie : checkCalorie,
    checkUser : checkUser
  });
})(jQuery);
