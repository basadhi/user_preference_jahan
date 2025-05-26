import { HomeUI } from "./home.js";
import { settings } from "./settings.js";
import { LoginPage } from "./loginpage.js";
import { SignupPage } from "./signuppage.js";


    
    
    webix.ui({
        container: "app",
        rows: [
          
            {
                view:"scrollview",
                body:{
                    view:"multiview",
                    id:"main_content",
                    cells:[{
                        
                        id:"home_ui",
                        ...HomeUI,},{
                        id:"settings_page",
                        ...settings,
                    }
                    ,{
                        id:"login",
                        ...LoginPage,
                    },{
                        id:"signup",
                        ...SignupPage,
                    }]
            }}
        ]
    });

window.addEventListener('resize', function() {
    
    webix.ui.resize();   
   
});