console.log('linked');

const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const modalBackground = document.getElementById('modalBackground');
const navRegisterBtn = document.getElementById('navRegisterBtn');
const navLoginBtn = document.getElementById('navLoginBtn');
let userId;

$('#navRegisterBtn').click(function() {
    console.log('clicked');
    $('#modal').empty();
    registerModal.style.display = 'block';
    modalBackground.style.display = 'block';
});

$('#navLoginBtn').click(function() {
    console.log('clicked');
    $('#modal').empty();
    loginModal.style.display = "block";
    modalBackground.style.display = "block";
});

$('#modalBackground').click(function() {
    registerModal.style.display = "none";
    loginModal.style.display = "none";
    modalBackground.style.display = "none";
});

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
        userId = sessionStorage.getItem('userID');
        let username = sessionStorage.getItem('userName');

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
                    description: description,
                    username: username
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

                        registerModal.style.display = "none";
                        modalBackground.style.display = "none";
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
                        
                        $('#loginUsername').val('');
                        $('#loginPassword').val('');

                        // hiding login modal
                        loginModal.style.display = "none";
                        modalBackground.style.display = "none";
                        navRegisterBtn.style.display = "none";
                        navLoginBtn.style.display = "none";

                        let displayName = sessionStorage.getItem('userName');
                        console.log(displayName);

                        $('#navUl').append(
                            `
                                <li class="nav__li">${displayName}</li>
                            `
                        )

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



    //------- project cards starts ---------
    // using tempory Ids to test cards work before adding json data
    let tempIds = [101,102,103,104,105,106,107,108,109,110,111,112];

    function projectLoop(){
        console.log(tempIds);
        let i = 0;
        for(i = 0; i < tempIds.length; i++){
            generateCard(i);
        }
    }
    projectLoop();
    
    function generateCard(x){
        $('.projects').append(
            `
            <div id="${tempIds[x]}" class="projects__card">
                <img class="projects__img" src="https://images.pexels.com/photos/461064/pexels-photo-461064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="project image">
                <h1 class="projects__heading hide">Project Heading</h1>
                <h3 class="projects__author hide">Author Name</h3>
                <p class="projects__description hide">Description</p>
            </div>
            `
        );
    }


    // adding active and displaying card content on hover
    $('.projects__card').hover(function(){
        $(this).addClass('active');
        // then when card is hovered over hide class is removed
        $('#'+this.id+' .projects__heading').removeClass('hide');
        $('#'+this.id+' .projects__author').removeClass('hide');
        $('#'+this.id+' .projects__description').removeClass('hide');
        }, function(){
        $(this).removeClass('active');
        // then when user leaves card hide class is added
        $('#'+this.id+' .projects__heading').addClass('hide');
        $('#'+this.id+' .projects__author').addClass('hide');
        $('#'+this.id+' .projects__description').addClass('hide');
    });
    //------- project cards ends ---------


}); // end of docuemnt ready function