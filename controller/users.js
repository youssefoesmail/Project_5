const {pool} = require('../models/db')

const login = (req,res)=>{
    const {email,password}=req.body;

  const values = [email];

  const query = `SELECT *
  FROM users
  WHERE email=$1;`

  pool.query(query,values).then(async(result)=>{
    console.log("res",result.rows);
    if (!result){
        res.status(403).json({
            success: false,
            massage: "The email does nt exist or the password you have entered is incorrect"
        })
    }
    
    console.log(result.rows[0].password, password);
    console.log("id",result.rows[0].id);

    const isValid = await bcrypt.compare(password, result.rows[0].password);
    
    console.log('isValid :>> ', isValid);

    console.log(isValid);

    if (!isValid){
        res.status(403).json({
            success: false,
            massage: "The email does nt exist or the password you have entered is incorrect"
        })
    }

    const options ={
        expiresIn: "60m"
    }
    
    const payload={
        userId:result.rows[0].id,
        role:result.rows[0].role_id
    }

    console.log("payload",payload);

    const userToken =jwt.sign(payload,process.env.SECRET,options)

    console.log('userToken :>> ', userToken);


    res.json({
        success: true,
        massage: "Valid login credentials",
        token:userToken
    })


}).catch((err)=> {
    res.send(err)
});


}

module.exports={
    login
}