var userRouter=require('./userRouter')
var heartSensorRouter=require('./heartSensorRouter')
var heartSensorDataRouter=require('./heartSensorDataRouter')
const checkLogin=require('../Middleware/CheckLogin')
function router(app){
    app.use('/user',userRouter)
    app.use('/heartSensor',heartSensorRouter)
    app.use('/heartSensorData',heartSensorDataRouter)
}
module.exports=router