require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const userRoute = require('./routers/user');
const blogRoute = require('./routers/blog')
const commentRoute = require('./routers/comment')
const { cheakAuthantication, requiredAuthantication } = require('./middlewares/authantication');
const path = require('path')
const Blog = require('./models/blog');


const app = express();
mongoose.connect(process.env.mongodb_url).then(()=>{console.log("mongodb connected succefully")});

app.use(express.urlencoded({extended : true}))
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(cheakAuthantication("Token"))
app.use(express.static(path.resolve('public')));
app.set('views', path.join(__dirname, 'views'));



app.use("/user", userRoute);
app.use("/blog", requiredAuthantication("Token"), blogRoute);
app.use("/comment", commentRoute);
app.get("/", async (req, res) => {
    try {
        const Blogs = await Blog.find({});
        for (const blog of Blogs) {
            const arr = blog.likes.map(like => like.userId.toString());

            if (req.user) {
                const idx = arr.includes(req.user._id.toString());
                blog.like = idx ? 1 : 0;
            } else {
                blog.like = 0;
            }
        }
        res.render("home", { user: req.user, blogs: Blogs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(8000 , ()=>{
    console.log(`sever is running on ${process.env.port}`);
})