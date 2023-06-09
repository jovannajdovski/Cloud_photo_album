// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  cognito: {
    // userPoolId: 'eu-central-1_64goN6Ndnc',
    // userPoolWebClientId : '1du0ehpveg5ksb7902704dhv0'
    userPoolId: 'eu-central-1_IBSUZkJOh',
    userPoolWebClientId : 'u6d4oag7ptqlqm6vr2an8ap0'
  },
  poolData : {
    UserPoolId: 'eu-central-1_IBSUZkJOh', // Your user pool id here
    ClientId: 'u6d4oag7ptqlqm6vr2an8ap0' // Your client id here
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
