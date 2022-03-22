$(document).ready(function() {
    console.log('ready');

    const registerModal = document.getElementById('registerModal');
    const loginModal = document.getElementById('loginModal');
    const addProjectModal = document.getElementById('addProjectModal');
    const modalBackground = document.getElementById('modalBackground');
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const searchInput = document.getElementById('searchInput');
    const userModal = document.getElementById('userModal'); 
    let userId;

    $('#navRegisterBtn').click(function() {
        console.log('clicked');
        registerModal.style.display = 'block';
        modalBackground.style.display = 'block';
    });

    $('#navLoginBtn').click(function() {
        console.log('clicked');
        loginModal.style.display = "block";
        modalBackground.style.display = "block";
    });

    $('#addProjectDiv').click(function() {
        console.log('clicked');
        $('#modal').empty();
        addProjectModal.style.display = 'block';
        modalBackground.style.display = 'block';
    });

    $('#modalBackground').click(function() {
        registerModal.style.display = "none";
        loginModal.style.display = "none";
        addProjectModal.style.display = 'none';
        modalBackground.style.display = "none";
        userModal.style.display = 'none';
    });

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
            viewProjects(); //called here to use url in allProjectsFromDB on page load
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
        let projectUrl = $('#addProjectProjectUrl').val();

        console.log(name, imgUrl, description, projectUrl);

        if(name == "" || imgUrl == "" || description == "" || projectUrl =="" || !userId) {
            alert("Please login and enter all fields");
        } else {
            $.ajax({
                url: `http://${url}/addProject`,
                type: 'POST',
                data: {
                    name: name,
                    image_url: imgUrl,
                    description: description,
                    username: username,
                    project_url: projectUrl,
                    user_id: userId
                },
                success: function(project) {
                    console.log(project);
                    alert('Project added');

                    $('#addProjectName').val('');
                    $('#addProjectImgUrl').val('');
                    $('#addProjectDescription').val('');
                    $('#addProjectProjectUrl').val('');
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
        let projectUrl = $('#updateProjectProjectUrl').val();

        console.log(id, name, imgUrl, description, projectUrl);

        if(id == "") {
            alert("please enter project ID");
        } else {
            $.ajax({
                url: `http://${url}/updateProject/${id}`,
                type: 'PATCH',
                data: {
                    name: name,
                    image_url: imgUrl,
                    description: description,
                    project_url: projectUrl
                },
                success: function(data) {
                    console.log(data);

                    $('#updateProjectId').val('');
                    $('#updateProjectName').val('');
                    $('#updateProjectImgUrl').val('');
                    $('#updateProjectDescription').val('');
                    $('#updateProjectProjectUrl').val();
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
                                <li class="nav__li nav__name" id="navName">${displayName}</li>
                            `
                        );

                        const navName = document.getElementById('navName');

                        $('#navName').click(function() {
                            console.log('navName clicked');
                            userModal.style.display = 'block';
                            modalBackground.style.display = 'block';
                        });

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
        const navName = document.getElementById('navName');

        navRegisterBtn.style.display = "block";
        navLoginBtn.style.display = "block";
        userModal.style.display = 'none';
        modalBackground.style.display = 'none';
        navName.style.display = 'none';
    })



    //------- project cards starts ---------
   

    function viewProjects(){
        $.ajax({
            url: `http://${url}/allProjectsFromDB`,
            type: 'GET',
            datatype: 'json',
            success: function(projectsFromMongo){
                console.log(projectsFromMongo);
                let i;
                document.getElementById('result').innerHTML = '';
                for(i=0; i<projectsFromMongo.length; i++){
                document.getElementById('result').innerHTML +=
                `
                <div id="${projectsFromMongo[i]._id}" class="projects__card">
                    <button class="projects__project-options">
                        <i class="fa-solid fa-ellipsis-vertical projects__options-icon"></i>
                    </button>
                    <div class="projects__dropdown-content">
                        <a>Update</a>
                        <a>Delete</a>
                      </div>
                    <a href="${projectsFromMongo[i].project_url}" target="blank">
                        <div class="projects__image-wrap">
                            <img class="projects__img" src="${projectsFromMongo[i].image_url}" alt="project image">
                        </div>
                    </a>
                    <h1 class="projects__heading hide">${projectsFromMongo[i].name}</h1>
                    <h3 class="projects__author hide">${projectsFromMongo[i].username}</h3>
                    <div class="projects__description-wrap hide">
                        <p class="projects__description" id="123${projectsFromMongo[i]._id}">${projectsFromMongo[i].description}</p>
                    </div>
                </div>
                `;
              }
                //placed in success function so elements can be selected afterwards
                // adding active and displaying card content on hover
                $('.projects__card').hover(function(){
                    console.log(url);
                    $(this).addClass('active');
                    // then when card is hovered over hide class is removed
                    $('#'+this.id+' .projects__heading').removeClass('hide');
                    $('#'+this.id+' .projects__author').removeClass('hide');
                    $('#'+this.id+' .projects__description-wrap').removeClass('hide');
                    }, function(){
                    $(this).removeClass('active');
                    // then when user leaves card hide class is added
                    $('#'+this.id+' .projects__heading').addClass('hide');
                    $('#'+this.id+' .projects__author').addClass('hide');
                    $('#'+this.id+' .projects__description-wrap').addClass('hide');
                });
                // adding active and displaying card content on hover ends

                

                /* When the user clicks on the button, 
                toggle between hiding and showing the dropdown content */
                $('.projects__dropdown-content').hide();

                $('.projects__project-options').click(function(){
                    let cardId = $(this).parent().attr('id');
                    console.log(cardId);
                    $('#'+cardId+' .projects__dropdown-content').toggle('show');
                });

                // Close the dropdown if the user clicks outside of it
                window.onclick = function(event) {
                  if (!event.target.matches('.projects__project-options')) {
                    $('.projects__dropdown-content').hide();
                  }
                }

            },
            error:function(){
              alert('unable to get products');
            }
        }) //ajax
    }
    //------- project cards ends ---------

    // Search project cards results
    searchInput.addEventListener('keyup', function(event) {
        if(event.keyCode == 13) {
            event.preventDefault();
            const searchTerm = $('#searchInput').val();

        }
    });


}); // end of docuemnt ready function