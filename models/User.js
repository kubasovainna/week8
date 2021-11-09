export default m =>{
    const UserSchema = m.Schema({
        login: String,
        password: String
    })
    return m.model('User', UserSchema)
}