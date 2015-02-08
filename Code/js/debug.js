// Prints the status of the controller buttons
function printButtons(contr)
{
    for(var prop in contrBtn)
        if(contr.getButton(contrBtn[prop]))
            console.log("Pressed: " + prop);    
}