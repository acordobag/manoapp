const passwordCheker = {
  methods: {
    passwordChecker (password) {
      if (password.length === 0) {
        return ''
      }

     // length is ok, lets continue.
      var strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
      var mediumRegex = new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g')
      var enoughRegex = new RegExp('(?=.{6,}).*', 'g')
      var bannedPasswords = [
     // see study here: http://smrt.io/JlNfrH
        '123456', '12345', '123456789', '1234567890', 'password', 'iloveyou', 'princess', 'rockyou', '1234567', '12345678',
        'abc123', 'nicole', 'daniel', 'babygirl', 'monkey', 'jessica', 'lovely', 'michael', 'ashley', '654321', 'qwerty',
        'password1', 'welcome', 'welcome1', 'password2', 'password01', 'password3',
        'p@ssw0rd', 'passw0rd', 'password4', 'password123', 'summer09', 'password6', 'password7',
        'password9', 'password8', 'welcome2', 'welcome01', 'winter12', 'spring2012', 'summer12', 'summer2012'
      ]

      if (enoughRegex.test(password) === false) {
        return 10
      } else if (bannedPasswords.indexOf(password) !== -1) {
        return 15
      } else if (strongRegex.test(password)) {
        return 100
      } else if (mediumRegex.test(password)) {
        return 75
      } else {
        return 50
      }
    }
  }
}

export default passwordCheker
