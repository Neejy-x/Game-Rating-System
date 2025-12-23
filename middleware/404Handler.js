exports.notFoundHandler = (req, res)=>{
    res.status(404).send("No page found");
}