/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 // Material Select Initialization
 $(document).ready(function() {
    $('.mdb-select').material_select();
    
    /*$('#modalAddToCart').on('click', '#addToCartButton', function(e){
        console.log('Cliquéé');
});;*/
    $('#addToCartButton').on('click', function(){
        var quantity = $('#clientQuantity').val();
        var prestations = [];
        var offerID = id;
        $(':checkbox:checked').each(function(i){
           prestations[i] = $(this).val(); 
        });
        var parameters = {quantity : quantity, offerID : offerID, prestations : prestations};
       console.log(parameters);
       console.log(prestations[0], prestations[1]);
       $.get('/addToCart', parameters, function(data){
           console.log('okay post');
       });
       
    });
    
    //$('#cartTable').bind('click', function(){
       $('#cartTable tbody > tr').each(function(){
          var offerID = $(this).find('td.one').html();
          var parameters = {offerID : offerID};
          var parameters2 = {prestationID : $(this).find('td.six').html()};
          var type = $(this).find('td.one');
          var grosseur = $(this).find('td.two');
          var prixUnitaire = $(this).find('td.four');
          var prestationName = $(this).find('td.six');
          $.get('/offer', parameters, function(data){
             type.html(data.chickenType);
             grosseur.html(data.chickenSize);
             prixUnitaire.html(data.unitPrice);
          });
          $.get('/prestation', parameters2, function(prestation){
              prestationName.html(prestation.name);
          });
       }); 
    //});
    
  });
  

