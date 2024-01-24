# funmap_visualization\

formatter: function (params, ticket, callback) {
                            node_go = go_data[params.name]
                            var content = `<table><thead><tr><th>GO Category</th><th>GO ID</th><th>Name</th><th>p-Value</th></tr></thead><tbody></tbody><tr><td>Biological Process</td><td>${node_go["</td></tr></table>`;
                            callback(ticket, toHTML(content));
                            return 'Loading';
                        },