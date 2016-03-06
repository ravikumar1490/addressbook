//creator Ravikumar
//AddressBook 1.0

var AddressFormatter = function() {
    var _init = function(){
    	var addressBook = new AddressBook();
        addressBook.initialize();
  	};

     //Utility
    function Utility(){

    }

    Utility.prototype.sort = function(obj){
        var temp_array = [];
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              temp_array.push(key);
            }
        }
        temp_array.sort();
        var temp_obj = {};
        for (var i=0; i<temp_array.length; i++) {
            temp_obj[temp_array[i]] = obj[temp_array[i]];
        }
        return temp_obj;
    };

    Utility.prototype.getContent = function(){
        if(localStorage){
            return JSON.parse(localStorage.getItem('addressbook'));
        }
        return false;
    };

    Utility.prototype.setContent = function(data){
        if(localStorage){
            localStorage.setItem('addressbook',JSON.stringify(this.sort(data)));
        }
    };

    Utility.prototype.fomatPhoneNumber = function(phonenumber){
       return phonenumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    };

    Utility.prototype.getId = function(firstName,lastName){
        return firstName.toLowerCase()+lastName.toLowerCase();
    };

    Utility.prototype.alert = function(type,message){
        $(".alert").addClass(type).show().text(message);
        setTimeout(function(){
            $(".alert").removeClass(type).hide();
        },1000);
    };
    //Address book
    function AddressBook(){
        this.currentId = null;
        this.searchData = null;
    }

    AddressBook.prototype = new Utility();

    AddressBook.prototype.initialize = function(){
        this.setupDatabase();
        this.bindElements();
    };

    AddressBook.prototype.setupDatabase = function(){
       if(this.getContent()){
            this.render();
        } else {
            this.setContent(defaultContacts);
            this.render();
        }
    };

    AddressBook.prototype.render = function(){
        var contacts = this.getContent();
        $(".contacts-list").html("");
        var that= this;
        $.each(contacts,function(i,item){
            $(".contacts-list").append("<a href='#' class='list-group-item' data-id="+i+">"+item.firstname+" <b>"+item.lastname+"</b></a>");
        });
        this.currentId = this.currentId || Object.keys(contacts)[0];
        this.drawContactView();
    };

    AddressBook.prototype.bindElements = function(){
        var that = this;
        $( ".contacts-list" ).delegate( "a", "click", function() {
            that.currentId = $(this).attr("data-id");
            that.drawContactView();
        });

        $("#addContact").on("click",function(){
            $("#editLink").text("Save");
            that.currentId = null;
            that.drawContactForm();
        });

        $("#editLink").on("click",function(){
            var $el = $(this);
            if($el.text() === "Save" || $el.text() === "Update" ){
                that.updateAddressBook();
            } else {
                $el.text("Update");
                that.drawContactForm();
            }
        });

        $( "#search" ).keyup(function() {
            that.search();
        });

        $( "#search" ).click(function() {
            that.searchData = that.getContent();
        });
    };

    AddressBook.prototype.drawContactView = function(){
        var data = this.getContent();
        var contact = data[this.currentId];
        if(contact){
            var content = '<address>';
                content +='<strong>'+contact.firstname+' '+contact.lastname+'</strong>';
                content +='</address>';
                content +='<address>';
                content +='<div class="label">mobile</div><br>';
                content +='<div class="mobile-number">'+this.fomatPhoneNumber(contact.mobile)+'</div>';
                content +='<div class="right-icons">';
                content +='<img src="img/chat.png"/>';
                content +='<img src="img/phone.png"/>';
                content +='</div>';
                content +='<div class="clearfix" />';
                content +='</address>';
                content +='<address>';
                content +='<div class="label">home</div><br>';
                content +='<div class="mobile-number">'+this.fomatPhoneNumber(contact.home)+'</div>';
                content +='<div class="right-icons">';
                content +='<img src="img/phone.png"/>';
                content +='</div>';
                content +='<div class="clearfix" />';
                content +='</address>';
                content +='<address>';
                content +='<div class="label">email</div><br>';
                content +='<a href="mailto:'+contact.email+'" class="mail">'+contact.email+'</a>';
                content +='</address>';
                content +='<address>';
                content +='<div class="label">address</div><br>';
                content +=''+contact.address+'';
                content +='</address>';

            $(".contacts-view").html(content);
            $("#editLink").text("Edit");
        }
        

    };

    AddressBook.prototype.drawContactForm = function(){
            var content = '<div class="form-group row">';
                content +='<label for="firstname" class="col-sm-3 form-control-label">First name</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="email" class="form-control" id="firstname" placeholder="">';
                content +='</div>';
                content +='</div>';
                content +='<div class="form-group row">';
                content +='<label for="lastname" class="col-sm-3 form-control-label">Last name</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="text" class="form-control" id="lastname" placeholder="">';
                content +='</div>';
                content +='</div>';
                content +='<div class="form-group row">';
                content +='<label for="mobile" class="col-sm-3 form-control-label">Mobile</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="tel" class="form-control" id="mobile" maxlength="10" placeholder="">';
                content +='</div>';
                content +='</div>';
                content +='<div class="form-group row">';
                content +='<label for="home" class="col-sm-3 form-control-label">Home</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="tel" class="form-control" id="home" maxlength="10" placeholder="">';
                content +='</div>';
                content +='</div>';
                content +='<div class="form-group row">';
                content +='<label for="email" class="col-sm-3 form-control-label">Email</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="email" class="form-control" id="email" placeholder="">';
                content +='</div>';
                content +='</div>';
                content +='<div class="form-group row">';
                content +='<label for="address" class="col-sm-3 form-control-label">Address</label>';
                content +='<div class="col-sm-8">';
                content +='<input type="text" class="form-control" id="address" placeholder="">';
                content +='</div>';
                content +='</div>';

                $(".contacts-view").html(content);
                var data = this.getContent();
                var contact = data[this.currentId];
                if(contact){
                    $('#firstname').val(contact.firstname);
                    $('#lastname').val(contact.lastname);
                    $('#mobile').val(contact.mobile);
                    $('#home').val(contact.home);
                    $('#email').val(contact.email);
                    $('#address').val(contact.address);
                }

        

    };
    AddressBook.prototype.updateAddressBook = function(){
        var dataObj ={
            firstname : $("#firstname").val(),
            lastname : $("#lastname").val(),
            mobile : $("#mobile").val(),
            home : $("#home").val(),
            email : $("#email").val(),
            address : $("#address").val()
        };
        if(this.validateForm(dataObj)){
            var data = this.getContent();
            var generatedId = this.getId(dataObj.firstname,dataObj.lastname);
            if(this.currentId && this.currentId !== generatedId){
                delete data[this.currentId];
            } 
            this.currentId = generatedId;
            if(!data[this.currentId]){
                data[this.currentId] = {};
            }
            data[this.currentId] = dataObj;
            this.setContent(data);
            this.alert("alert-success","Contact saved");
            this.render();
        }
        

    };

    AddressBook.prototype.validateForm =function(dataObj){
        var emailFilter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        var phoneFilter = /^http:\/\//;
        if(!dataObj.firstname || !dataObj.lastname ||
            !dataObj.mobile || !dataObj.home ||
           !dataObj.email || !dataObj.address){
            this.alert("alert-danger","Some fields are missing.");
            return false;
        } else if(isNaN(dataObj.mobile) ||  isNaN(dataObj.home)){
            this.alert("alert-danger","Please correct mobile number.");
            return false;
        } else if(!emailFilter.test(dataObj.email)){
            this.alert("alert-danger","Enter a valid e-mail address.");
            return false;
        }
        return true;
    };

    AddressBook.prototype.search =function(){
        var searchVal = $("#search").val().toLowerCase().replace(/\s+/g, '');
        var contacts = this.searchData;
        $(".contacts-list").html("");
        var that= this;
        $.each(contacts,function(i,item){
            if(i.indexOf(searchVal) !== -1){
                $(".contacts-list").append("<a href='#' class='list-group-item' data-id="+i+">"+item.firstname+" <b>"+item.lastname+"</b></a>");
            }
        });
        this.currentId = Object.keys(contacts)[0];
        this.drawContactView();

    };
    return {
        init:_init
    }
  
}();
$(window).load(AddressFormatter.init);