const express=require("express");
const bodyparser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));



app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",(req,res)=>{
    const fname=req.body.firstname;
    const lname=req.body.lastname;
    const email=req.body.email;
    // res.send(`${fname} ${lname} your password is ${email}`);
    var data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }
            }
        ]
    };

    var jsonData=JSON.stringify(data);

    const url="https://us5.api.mailchimp.com/3.0/lists/73d2718e41";

    const options={
        method:"POST",
        auth:"amish:d2f4136490c90c6707e3c59586337510-us5"
    }

    const request=https.request(url,options,(response)=>{
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();



})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("listening to port");
})


// const apiKey="d2f4136490c90c6707e3c59586337510-us5";
// const listId="73d2718e41";