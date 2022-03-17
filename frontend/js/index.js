console.log('linked');

$(document).ready(function() {
    console.log('ready');

    let url;

    $.ajax({
        url: 'config.json',
        type: 'GET',
        crossDomain: true,
        dataType: 'json',
        success: function(configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log(url);
        },
        error: function(error) {
            console.log(error);
        }
    }); // end of ajax

    // add project to database
    $('#addProjectSubmitBtn').click(function() {
        event.preventDefault();

        let name = $('#addProjectName').val();
        let imgUrl = $('#addProjectImgUrl').val();
        let description = $('#addProjectDescription').val();
        let userId = sessionStorage.getItem('userID');

        console.log(name, imgUrl, description);

        if(name == "" || imgUrl == "" || description == "" || !userId) {
            alert("Please login and enter all fields");
        } else {
            $.ajax({
                url: `http://${url}/addProject`,
                type: 'POST',
                data: {
                    name: name,
                    image_url: imgUrl,
                    description: description
                },
                success: function(project) {
                    console.log(project);
                    alert('Project added');

                    $('#addProjectName').val('');
                    $('#addProjectImgUrl').val('');
                    $('#addProjectDescription').val('');
                },
                error: function() {
                    console.log('Error: cannot call api');
                }
            }); // end of ajax
        } // end of if statement
    }); // end of add project

    // update project
    $('#updateProjectSubmitBtn').click(function() {
        event.preventDefault();

        let id = $('#updateProjectId').val();
        let name = $('#updateProjectName').val();
        let imgUrl = $('#updateProjectImgUrl').val();
        let description = $('#updateProjectDescription').val();

        console.log(id, name, imgUrl, description);

        if(id == "") {
            alert("please enter projuct ID");
        } else {
            $.ajax({
                url: `http://${url}/updateProject/${id}`,
                type: 'PATCH',
                data: {
                    name: name,
                    image_url: imgUrl,
                    description: description
                },
                success: function(data) {
                    console.log(data);

                    $('#updateProjectId').val('');
                    $('#updateProjectName').val('');
                    $('#updateProjectImgUrl').val('');
                    $('#updateProjectDescription').val('');
                },
                error: function() {
                    console.log('error: cannot update');
                }
            }); // end of ajax
        } // end of if statement
    }); // end of update project

    // delete project
    $('#deleteProjectSubmitBtn').click(function() {
        event.preventDefault();
         
        let id = $('#deleteProjectId').val();
        console.log(id);

        if(id == "") {
            alert("please enter project id");
        } else {
            $.ajax({
                url: `http://${url}/deleteProject/${id}`,
                type: 'DELETE',
                success: function(data) {
                    console.log('deleted');
                    alert('deleted');

                    $('#deleteProjectId').val('');
                },
                error: function() {
                    console.log('error: cannot delete');
                }
            }); // end of ajax
        } // end of if statement
    }); // end of delete project

    // register user
    $('#signUpBtn').click(function () {
        event.preventDefault();

        let username = $('#signUpUsername').val();
        let email = $('#signUpEmail').val();
        let password = $('#signUpPassword').val();

        console.log(username, email, password); //remove when development is finished

        if(username == '' || email == '' || password == '') {
            alert('please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/registerUser`,
                type: 'POST',
                data: {
                    username: username,
                    email: email,
                    password: password
                },
                success: function (user) {
                    console.log(user); //remove when development is finished
                    if(user !== 'Username already taken. Please use a different username') {
                        alert('Thank you for registering. Please login');

                        $('#signUpUsername').val('');
                        $('#signUpEmail').val('');
                        $('#signUpPassword').val('');
                    } else {
                        alert('Username already taken. Please use a different username');

                        $('#signUpUsername').val('');
                        $('#signUpEmail').val('');
                        $('#signUpPassword').val('');
                    } // end of if statements
                }, // end of success
                error: function() {
                    console.log('Error: cannot call api');
                } // end of error
            }); //end of ajax
        }// end of first if statement
    }) // end of register user

    // Login user
    $('#loginBtn').click(function() {
        event.preventDefault();

        let username = $('#loginUsername').val();
        let password = $('#loginPassword').val();

        console.log(username, password); //remove when development is finished

        if(username == ''  || password == '') {
            alert('Please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/loginUser`,
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: function(user) {
                    console.log(user);

                    if(user == 'User not found. Please register') {
                        alert('User not found. Please register');
                    } else if(user == 'not authorized') {
                        alert('Please try again with the correct details');

                        $('#loginUsername').val('');
                        $('#loginPassword').val('');
                    } else {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('userEmail', user['email']);
                        console.log(sessionStorage);
                        alert('Welcome back');
                        
                        $('#loginUsername').val('');
                        $('#loginPassword').val('');
                    } // end of inner if statements
                }, // end of success
                error: function() {
                    console.log('cannot call api');
                    alert('Unable to login');
                } // end of error
            }); // end of ajax
        } // end of outer if statement
    }); // end of login user

    $('#logoutBtn').click(function() {
        sessionStorage.clear();
        alert('You are now logged out');
        console.log(sessionStorage);
    })

    // projects card starts
    // when card is hovered over hide class is removed
    // $('.projects__card').hover(function() {
    //     $('.projects__heading').removeClass('hide');
    // });
    

    $('.projects__card').hover(function(){
        // alert(this.id);
        $('.projects__heading').removeClass('hide');
        }, function(){
        $('.projects__heading').addClass('hide');
      });
    // projects card ends


}); // end of docuemnt ready function