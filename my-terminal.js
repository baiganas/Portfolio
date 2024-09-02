$(document).ready(function() {
    const root = '~';
    let cwd = root;

    const directories = {
        education: [
            '',
            '<white>education</white>',
            '* <a href="https://en.wikipedia.org/wiki/University_of_Mumbai">Mumbai University</a> <yellow>"Bachelors of Engineering in Information Systems "</yellow> 2017 - 2021',
            '* <a href="https://www.northeastern.edu/">Northeastern University</a> Masters of Science <yellow>"Information Systems"</yellow> 2023-2025',
            ''
        ],
        experience: [
            '',
            '<white>Work Experience</white>',
            '* <a href="https://www.ingrammicro.com/en-us/company/about-us">Ingram Micro</a> <yellow>Data Engineer</yellow> 2022-2023',
            '* <a href="https://www.ingrammicro.com/en-us/company/about-us">Ingram Micro</a> <yellow>Software Engineer(FrontEnd)</yellow> 2021-2022',
            '* <a href="https://www.lntebg.in/">Larsen and Toubro Electrical and Automation</a> <yellow>Intern - Automation</yellow> 2019',
            ''
        ],
        Resume: [
            '',
            '<white>Resume</white>',
            '* <a href="https://drive.google.com/file/d/1Qa4RbCjx4LM2_5puDc2XjjmQmWQUMGrX/view?usp=sharing">Link</a> <yellow>Resume</yellow>',
            ''
        ],
        projects: [
            '',
            '<white>Open Source projects</white>',
            [
                ['All the Earthquakes',
                 'https://github.com/baiganas/capstone/blob/main/Anasbaig_002837748_Capstone.ipynb',
                 'Analysis and Prediction of Earthquakes Using Decision Tree, Regression, XGboost and Random Forest'
                ],
                ['Musify',
                 'https://github.com/anasbaig10/spotify_clone',
                 'Spotify like Music platform implementing Javascript, PHP, Mysql'
                ],
                ['Off-Campus Housing',
                 'https://github.com/anasbaig10/StaySafeScholers',
                 'Designed and implemented a Database for off-campus housing with triggers, Views, Stored Procedures and Visualization using PowerBI'
                ],
                ['MazeSolver',
                 'https://github.com/anasbaig10/MazeSolver',
                 'Solving a Maze using DFS, BFS And A* Algorithms in Java and creating a GUI using Swing UI'
                ],
                ['AWS-DataEngineering',
                'https://github.com/anasbaig10/AWS-DataEngineering',
                'Doing an ETL on Spotify 2023 Music data using Kafka and publishing on AWS also Leveraging services like S3, Athena, Glue, EC2'
                ],
            ].map(([name, url, description = '']) => {
                return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
            }),
            ''
        ].flat(),
        skills: [
            '',
            '<white>languages</white>',
            [
                'JavaScript', 'TypeScript', 'REST API', 'JQuery', 'Python', 'SQL', 'PHP', 'Bash', 'ReactJs', 'Big Query', 'CI/CD', 'Agile Scrum'
            ].map(lang => `* <yellow>${lang}</yellow>`),
            '',
            '<white>libraries</white>',
            [
                'React.js', 'Redux', 'Jest', 'Node.js', 'ES6', 'Data Visualization', 'Postman', 'Scikit-learn', 'Keras', 'Matplotlib'
            ].map(lib => `* <green>${lib}</green>`),
            '',
            '<white>tools</white>',
            [
                'Docker', 'git', 'GNU/Linux', 'AWS', 'GCP', 'Snowflake'
            ].map(tool => `* <blue>${tool}</blue>`),
            ''
        ].flat()
    };

    const commandsWithDescriptions = [
        { name: 'help', description: 'Display available sections.' },
        { name: 'cd', description: 'Change the current directory.' },
        { name: 'ls', description: 'List the contents of the current directory.' },
        { name: 'clear', description: 'Clear the terminal screen.' }
    ];

    const commands = {
        help() {
            displayMainSections();
        },
        cd(dir = null) {
            const dirs = Object.keys(directories);
            if (dir === null || (dir === '..' && cwd !== root)) {
                cwd = root;
            } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
                cwd = dir;
            } else if (dirs.includes(dir)) {
                cwd = root + '/' + dir;
            } else {
                term.error('Wrong directory');
            }
        },
        ls(dir = null) {
            const dirs = Object.keys(directories);
            if (dir) {
                if (dir.match(/^~\/?$/)) {
                    print_dirs();
                } else if (dir.startsWith('~/')) {
                    const path = dir.substring(2);
                    if (path in directories) {
                        this.echo(directories[path].join('\n'), {raw: true});
                    } else {
                        this.error('Invalid directory');
                    }
                } else if (cwd === root) {
                    if (dir in directories) {
                        this.echo(directories[dir].join('\n'), {raw: true});
                    } else {
                        this.error('Invalid directory');
                    }
                } else if (dir === '..') {
                    print_dirs();
                } else {
                    this.error('Invalid directory');
                }
            } else if (cwd === root) {
                print_dirs();
            } else {
                const dir = cwd.substring(2);
                this.echo(directories[dir].join('\n'), {raw: true});
            }
        },
        clear() {
            term.clear();
        }
    };

    function print_dirs() {
        const dirs = Object.keys(directories);
        term.echo(dirs.map(dir => {
            return `<u><blue class="directory">${dir}</blue></u>`;
        }).join('\n'), { raw: true });
    }

    function displayMainSections() {
        const sections = Object.keys(directories).map(dir => 
            `<u><blue class="section">${dir}</blue></u>`
        ).join('  ');
        term.echo('Available sections (click to explore):', { raw: true });
        term.echo(sections, { raw: true });
    }

    const font = 'Slant';
    const user = 'visitor';
    const server = 'anas-portfolio';

    function prompt() {
        return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
    }

    figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
    figlet.preloadFonts([font], ready);

    const term = $('body').terminal(commands, {
        greetings: false,
        checkArity: false,
        completion(string) {
            const cmd = this.get_command();
            const { name, rest } = $.terminal.parse_command(cmd);
            const dirs = Object.keys(directories);
            if (['cd', 'ls'].includes(name)) {
                if (rest.startsWith('~/')) {
                    return dirs.map(dir => `~/${dir}`);
                }
                if (cwd === root) {
                    return dirs;
                }
            }
            return Object.keys(commands);
        },
        prompt
    });

    term.on('click', '.directory', function() {
        const dir = $(this).text();
        term.exec(`cd ~/${dir}`);
        term.exec(`ls`);
    });

    term.on('click', '.command', function() {
        const command = $(this).text();
        term.exec(command);
    });

    term.on('click', '.section', function() {
        const section = $(this).text();
        term.exec(`cd ${section}`);
        term.exec('ls');
    });

    function render(text) {
        const cols = term.cols();
        return figlet.textSync(text, {
            font: font,
            width: cols,
            whitespaceBreak: true
        });
    }

    function ready() {
        console.log('Ready function called');
        term.echo(() => {
            const ascii = render("Anas Baig Portfolio");
            const instructions = `
Welcome to my Interactive Terminal Portfolio!

How to use:
1. Type 'help' or click on it to see available sections.
2. Click on any blue underlined text to explore that section.
3. Use 'cd ..' to return to the main menu.
4. Type 'clear' to clear the screen.

You can use the following commands:

${commandsWithDescriptions.map(cmd => `${cmd.name}: ${cmd.description}`).join('\n')}

Explore my portfolio by typing 'help' or using the commands above:
`;
            return `${ascii}\n${instructions}\n`;
        }, { ansi: true });
    }

    const formatter = new Intl.ListFormat('en', {
        style: 'long',
        type: 'conjunction',
    });

    const command_list = Object.keys(commands);
    const formatted_list = command_list.map(cmd => `<white class="command">${cmd}</white>`);
    const help = formatter.format(formatted_list);

    const any_command_re = new RegExp(`^\s*(${command_list.join('|')})`);
    $.terminal.new_formatter([any_command_re, '<white>$1</white>']);

    const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);
    $.terminal.new_formatter([re, function(_, command, args) {
        return `<white>${command}</white><aqua>${args}</aqua>`;
    }]);
});
