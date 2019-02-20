//function listIssues(projectHref)
//{
//    jQuery.ajax({
//        url: '/api/forge/bim360/container?href=' + projectHref,
//        success: function (res) {
//            jQuery.ajax({
//                url: 'api/forge/bim360/account/'+ res.hubId+'/container/' + res.containerId,
//                success: function (issues) {
//                    var rootCauseHash = {};
//                    issues.forEach(function (issue) {
//                        if (issue.attributes.root_cause == null) issue.attributes.root_cause = 'Nao definida';
//                        if (rootCauseHash[issue.attributes.root_cause] == null) {
//                            rootCauseHash[issue.attributes.root_cause] = {};
//                            rootCauseHash[issue.attributes.root_cause]['2h'] = [];
//                            rootCauseHash[issue.attributes.root_cause]['4h'] = [];
//                            rootCauseHash[issue.attributes.root_cause]['Older'] = [];
//                        }

//                        var now = Date.now();
//                        var issueDate = new Date(issue.attributes.created_at);
//                        var diff = (now - issueDate.getTime()) / 1000 / 60 / 60;

//                        if (diff < 2)
//                            rootCauseHash[issue.attributes.root_cause]['2h'].push(issue);
//                        else if (diff < 4)
//                            rootCauseHash[issue.attributes.root_cause]['4h'].push(issue);
//                        else 
//                            rootCauseHash[issue.attributes.root_cause]['Older'].push(issue);

//                    });

//                    console.log(rootCauseHash); 
//                }
//            });
//        }
//    });
//}

function listIssues(projectHref) {
    jQuery.ajax({
        url: '/api/forge/bim360/container?href=' + projectHref,
        success: function (res) {
            jQuery.ajax({
                url: 'api/forge/bim360/account/' + res.hubId + '/container/' + res.containerId,
                success: function (issues) {
                    //var lista = [];
                    var rootCauseHash = {};
                    var total = {
                        'name': 'Total',
                        '2h': 0,
                        '4h': 0,
                        'Older': 0

                    }
                    issues.forEach(function (issue) {
                        if (issue.attributes.root_cause == null) issue.attributes.root_cause = 'Nao definida';
                        if (rootCauseHash[issue.attributes.root_cause] == null) {
                            rootCauseHash[issue.attributes.root_cause] = {};
                            rootCauseHash[issue.attributes.root_cause]['name'] = issue.attributes.root_cause;
                            rootCauseHash[issue.attributes.root_cause]['2h'] = 0;
                            rootCauseHash[issue.attributes.root_cause]['4h'] = 0;
                            rootCauseHash[issue.attributes.root_cause]['Older'] = 0;
                        }

                        var now = Date.now();
                        var issueDate = new Date(issue.attributes.created_at);
                        var diff = (now - issueDate.getTime()) / 1000 / 60 / 60;

                        if (diff < 2) {
                            rootCauseHash[issue.attributes.root_cause]['2h']++;
                            total['2h']++;
                        } else if (diff < 4) {
                            rootCauseHash[issue.attributes.root_cause]['4h']++;
                            total['4h']++;
                        } else {
                            rootCauseHash[issue.attributes.root_cause]['Older']++;
                            total['Older']++;
                        }

                    });

                    console.log(rootCauseHash);

                    Object.keys(rootCauseHash).forEach(function (rootCause) {
                        var entry = rootCauseHash[rootCause];
                        $('#idDaTabela tr:last').after('<tr><td>' + rootCause + '</td><td>' + entry['2h'] + '</td><td>' + entry['4h'] + '</td><td>' + entry['Older'] + '</td></tr>');
                    });
                    $('#idDaTabela tr:last').after('<tr><td>' + total['name'] + '</td><td>' + total['2h'] + '</td><td>' + total['4h'] + '</td><td>' + total['Older'] + '</td></tr>');

                }
            });
        }
    });
}

