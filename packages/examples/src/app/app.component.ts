import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Router} from '@angular/router';

interface IPage {
    title: string;
    url: string;
    icon: string;
    subPages?: IPage[];
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public selectedUrl = '/';
    public appPages: IPage[] = [
        {
            title: 'Home',
            url: '/',
            icon: 'home',
        },
        {
            title: 'Tree',
            url: '/tree',
            icon: 'git-merge',
            subPages: [
                {
                    title: 'Basic',
                    url: '/tree/basic',
                    icon: 'git-merge',
                },
                // {
                //     title: 'Lines',
                //     url: '/tree/lines',
                //     icon: 'git-merge',
                // },
            ]
        },
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        router: Router,
    ) {
        this.initializeApp();
        router.events.subscribe(() => {
            this.selectedUrl = window.location.pathname.replace('/examples/', '/');
        });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
