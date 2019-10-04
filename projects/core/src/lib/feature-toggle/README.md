env.js

var Env = {
version: '1.1.1',
copyright: '© 2019 by ...',
feature: {
someFeature1: true,
someFeature2: 'option1'
}
};

<div *flexyFeatureToggle="'someFeature1'"></div>

<div *flexyFeatureToggle="'someFeature2';option:'option1'"></div>
