const formatLink = (link) =>{
    if(link[1]==='/'){
        link = link.substr(1)
    }
    return link
}

module.exports = {formatLink}