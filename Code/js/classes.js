function Controller()
{
    this.buttons = [];
    this.rawButtons = [];
    this.prevButtons = [];
    
    for(var i = 0; i < maxContrBtns; i++)
    {
        this.buttons[i] = false;
        this.rawButtons[i] = false;
        this.prevButtons[i] = false;
    }
}

Controller.prototype.update = function(contr)
{
    var exists = typeof contr !== "undefined";
    
    for(var i = 0; i < maxContrBtns; i++)
    {
        this.rawButtons[i] = exists ? Boolean(contr.buttons[i].pressed) : false;
        this.buttons[i] = this.rawButtons[i] && !this.prevButtons[i];
        this.prevButtons[i] = this.rawButtons[i];
    }
};

Controller.prototype.getButton = function(btnId)
{
    return this.buttons[btnId];
};