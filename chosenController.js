$(document).ready(function(){
  var selectList = $( '#fucker' );


  selectList.chosen({
      disable_search_threshold: 10
    });
  console.log(sharedNodesOrder);
  sharedNodesOrder.forEach(function(d) {
    selectList.append($("<option></option>")
                            .attr("value", d[1])
                            .text(d[0]));
  });
});