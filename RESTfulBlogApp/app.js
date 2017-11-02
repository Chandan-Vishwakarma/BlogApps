const   express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        methodOverride = require("method-override");
        
// App Configuration       
mongoose.connect("mongodb://localhost/resful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));

// mongoose model configuration
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type : Date, default : Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     name : "Test Blog",
//     image : "https://images.unsplash.com/photo-1440658172029-9d9e5cdc127c?auto=format&fit=crop&w=826&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body : "This is a test blog post"
//     },function(err,blog){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(blog);
//     }
// });

// Restful Routes
app.get('/',function(req,res){
    res.redirect('/blogs');
});

// Index Route
app.get('/blogs',function(req, res) {
    
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs : blogs});
        }
    });
});

// New Route
app.get('/blogs/new',function(req, res) {
    res.render("new");
});

// Creating new blog
app.post('/blogs',function(req,res){
    Blog.create(req.body.blog,function(err,blog){
        if(err){
            res.redirect("/new");
        }else{
            res.redirect("/blogs");
        }
    });
});

// show route
app.get('/blogs/:id',function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            console.log("/blogs");
        }else{
            res.render("show",{blog:foundblog});
        }
    });
});

// edit route
app.get('/blogs/:id/edit',function(req, res) {
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render("edit",{blog : foundblog});
        }
    });
});

// update route
app.put('/blogs/:id',function(req, res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
      if(err){
          res.redirect("/blogs");
      }else{
          res.redirect("/blogs/" + req.params.id);
      }
  }); 
});

// delete route
app.delete('/blogs/:id',function(req, res){
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect('/blogs');
      }else{
          res.redirect('/blogs');
      }
   });
});

app.get('*',function(req,res){
    res.send('Error page not found');    
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log('server has started');
});