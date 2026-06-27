export const MODES = [
    { id:'pomodoro', name:'Pomodoro', icon:'🍅', defaults:{focus:25,break:5,rounds:4} },
    { id:'deepwork', name:'Deep Work', icon:'🧠', defaults:{focus:90,break:15} },
    { id:'breathing', name:'Breathing', icon:'🧘', defaults:{inhale:4,hold:4,exhale:4,hold2:4,cycles:5} },
    { id:'interval', name:'Interval', icon:'🔄', defaults:{focus:30,break:10,rounds:6} },
    { id:'study', name:'Study', icon:'📚', defaults:{focus:50,break:10} },
    { id:'exam', name:'Exam', icon:'📝', defaults:{questions:20,time:60} },
    { id:'reading', name:'Reading', icon:'📖', defaults:{pages:30,time:30} },
    { id:'coding', name:'Coding', icon:'💻', defaults:{focus:45} },
    { id:'workout', name:'Workout', icon:'💪', defaults:{exercise:45,rest:15,rounds:8} },
    { id:'custom', name:'Custom', icon:'⚙️', defaults:{focus:30,break:5,rounds:4} },
    { id:'stopwatch', name:'Stopwatch', icon:'⏱️', defaults:{} },
    { id:'countdown', name:'Countdown', icon:'⏲️', defaults:{focus:30} }
];
