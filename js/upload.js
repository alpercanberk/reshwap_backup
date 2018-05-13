function run(){

  //grab user
  var db = firebase.database();
  var email = firebase.auth().currentUser.uid;

  var ref = db.ref("forms");

  //makes sure all fields needed are there

  //make photo small


  filePresent = false;// used in the save function to check if the file exists. Is set to false by the removeFile() function.
        function editPic() {
        $("#removeDiv").empty();
        var fileElement = $("#post-file")[0];
        var filePath = $("#post-file").val();
        var fileName = filePath.split("\\").pop();
        console.log("location 1")
        if (fileElement.files.length > 0) {
          var file = fileElement.files[0];
          console.log(file);
          loadImage(file);
        }
      }

      //loadImage FUNCTION BEGINS HERE
function loadImage(src){
  //  Prevent any non-image file type from being read.
  if(!src.type.match(/image.*/)){
    console.log("The dropped file is not an image: ", src.type);
    return;
  }

  //  Create our FileReader and run the results through the render function.
  var reader = new FileReader();
  reader.onload = function(e){
    render(e.target.result);
  };
  reader.readAsDataURL(src);
}


//The rendering of the image function.
var MAX_HEIGHT = 500;//if you change height of the picture also change height of the canvas and the div!!!
var MAX_WIDTH = 300;
function render(src){
  var image = new Image();
  image.onload = function(){
    var canvas = document.getElementById("myCanvas");
    if(image.height > image.width || image.height > MAX_HEIGHT ) { //"||" means or
      image.width *= MAX_HEIGHT / image.height;
      image.height = MAX_HEIGHT;
    }
    if (image.width > MAX_WIDTH){//
      // image.height *= MAX_HEIGHT / image.width;
      image.width = MAX_HEIGHT;
    }
    // var ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // canvas.width = image.width;
    // canvas.height = image.height;
    // ctx.drawImage(image, 0, 0, image.width, image.height);
  };
  image.src = src;
  filePresent = true;
  // removeButton();//call on the removeButton function to create it.
}

function removeFile(){
        document.getElementById("myCanvas").getContext("2d").clearRect(0, 0, document.getElementById("myCanvas").width, document.getElementById("myCanvas").height);//this weird thing would clear the canvas content
        filePresent = false; //shows that the file has been removed.
        $("#removeDiv").empty();
      }




  var entry ={
        user: email,
        category: $("#category").val(),
        title: $("#title").val(),
        describe: $("#describe").val()
      };

      //post entry
    ref.push(entry);
    alert("thanks mate");
    document.location.reload();


}
