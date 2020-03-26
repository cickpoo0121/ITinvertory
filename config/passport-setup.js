const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const key = require("./key");
passport.serializeUser((user, done)=>{
    done(null, user);
});

passport.deserializeUser((id, done)=>{
    //TODO: //genarally, u must query for id in db
    done(null, id); 
});

passport.use(
    new googleStrategy(
        {
            clientID: key.google.clientID,
            clientSecret: key.google.clientSecret,
            callbackURL: "/auth/google/redirect"
        },
        (accessToken, refreshToken, profile, done) => {
            // console.log(profile);
            // console.log(profile.displayName);
            // console.log(profile.emails[0].value);
            // console.log(profile.photos[0].value);

            // const user1 = {id: profile.id};
            
            const user = {name: profile.displayName, email: profile.emails[0].value, photo: profile.photos[0].value};

            done(null, user);
        }
    )
);