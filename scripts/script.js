$(document).ready(function () {
    const fullName = $('#fullName');
    fullName.on('keydown', function (e) {
        const number = parseInt(e.key);
        if (!isNaN(number)) {
            return false;
        }
    });

    const username = $('#username');
    username.on('keydown', function (e) {
        const point = e.key;
        if (point === '.' || point === ',') {
            return false;
        }
    });

    const leftText = $('.left-text');
    const password = $('#password');
    const label = $('.left-label');
    const formButton = $('#button');
    const input = $('.left-input');
    const repeatPassword = $('#repeat-password');
    const popup = $('#popupContainer');
    const login = $('#login');
    const registration = $('#registration');
    const title = $('#title');
    const email = $('#E-mail');
    const checkbox = $('#checkbox');

    function buttonClick() {
        input.css('border-bottom-color', '#C6C6C4');
        input.next().hide();
        input.next().text('');
        checkbox.next().hide();
        for (let i = 0; i < input.length; i++) {
            if (!input.eq(i).val() && input.eq(i).is(':visible')) {
                input.eq(i).css('border-bottom-color', 'red');
                input.eq(i).next().text('Заполните поле ' + label.eq(i).text()).show()
                input.eq(i).next().css('display', 'block');
                return false;
            }
        }

        if (fullName.val().search(/[А-Я][а-я]+\s*/) === -1) {
            fullName.css('border-bottom-color', 'red');
            fullName.next().css('display', 'block');
            fullName.next().text('FullName может содержать только буквы и пробел')
            return false;
        }

        if (username.val().search(/[а-яА-Яa-zA-Z0-9-_]+\s*/) === -1) {
            username.css('border-bottom-color', 'red');
            username.next().css('display', 'block');
            username.next().text('username может содержать только буквы, цифры, символ подчеркивания и тире')
            return false;
        }

        if (email.val().search(/[a-zA-Z0-9_.+-]+@gmail.com\s*/) === -1) {
            email.css('border-bottom-color', 'red');
            email.next().css('display', 'block');
            email.next().text('email должен быть в формате *******@gmail.com')
            return false;
        }

        if (password.val().search(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}\s*/) === -1) {
            password.css('border-bottom-color', 'red');
            password.next().css('display', 'block');
            password.next().text('Поле пароля должно содержать минимум 8 символов, среди которых есть:\n' +
                '- хотя бы одна заглавная буква\n' +
                '- хотя бы одна цифра\n' +
                '- хотя бы один спецсимвол')
            return false;
        }


        if (password.val() !== repeatPassword.val()) {
            alert('Пароли не совпадают');
            return false;
        }

        if (!checkbox.is(':checked')) {
            checkbox.next().css('display', 'block');
            checkbox.next().text('Примите соглашение');
            return false;
        }

        const client = {
            name: fullName.val(),
            username: username.val(),
            email: email.val(),
            password: password.val()
        }

        let clients = localStorage.getItem('clientsArray');
        let clientsArray = [];
        if (clients) {
            clientsArray = JSON.parse(clients);
        }
        clientsArray.push(client);
        localStorage.setItem('clientsArray', JSON.stringify(clientsArray));

        popup.show();
    }

    formButton.click(function () {
        buttonClick();
    });

    registration.click(function () {
        formButton.off('click');
        title.text('Get your free account');
        login.show();
        registration.hide();
        fullName.parent().show();
        email.parent().show();
        repeatPassword.parent().show();
        checkbox.parent().show();
        formButton.text('Sign Up');
        clearInputs();

        formButton.click(buttonClick);
    });

    $('#svg').on('click', popupButtonClick);
    $('#popupButton').on('click', popupButtonClick);

    function popupButtonClick() {
        popup.hide();
        for (let i = 0; i < input.length; i++) {
            input.eq(i).val('');
        }
        showLoginErrors();
    }

    login.click(showLoginErrors);

    function showLoginErrors() {
        formButton.off('click');
        title.text('Log in to the system');
        login.hide();
        registration.show();
        fullName.parent().hide();
        email.parent().hide();
        repeatPassword.parent().hide();
        checkbox.parent().hide();
        formButton.text('Sign In');
        clearInputs();

        formButton.on('click', function () {
            input.css('border-bottom-color', '#C6C6C4');
            input.next().hide();

            if (!username.val()) {
                username.next().css('display', 'block');
                username.next().text('Заполните поле ' + username.text())
                username.css('border-bottom-color', 'red');
                return false;
            }

            if (!password.val()) {
                password.next().css('display', 'block');
                password.next().text('Заполните поле ' + password.text())
                password.css('border-bottom-color', 'red');
                return false;
            }

            let clients = localStorage.getItem('clientsArray');
            let clientsArray = JSON.parse(clients);
            const currentUser = clientsArray && clientsArray.length > 0 ? clientsArray.find(client => client.username === username.val() && client.password === password.val()) : null;

            if (currentUser) {
                title.parent().css('align-items', 'center');
                title.text('Welcome, ' + currentUser.name + '!');
                formButton.text('Exit');
                leftText.hide();
                login.hide();
                username.parent().hide();
                password.parent().hide();
                formButton.off('click');
                registration.off('click');
                formButton.click(exit);
            } else {
                password.next().css('display', 'block');
                password.next().text('Неверный логин или пароль');
            }
        });

        registration.click(exit);
    }

    function clearInputs() {
        for (let i = 0; i < input.length; i++) {
            input.eq(i).val('');
            input.eq(i).css('border-bottom-color', '#C6C6C4');
            input.eq(i).next().text('').hide();
        }
    }

    function exit() {
        title.parent().css('align-items', 'unset');
        window.location.reload();
    }
});
