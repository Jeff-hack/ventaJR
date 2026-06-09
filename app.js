// En renderResumen() - cálculo de ganancia bruta corregido
var ganancia = 0;
var gastosTotal = 0;
Object.keys(data).forEach(function(k){
  if(k.substring(0,7) !== mesActual) return;
  var d = data[k];
  (d.ventas || []).forEach(function(v){
    if(v.items && v.items.length){
      v.items.forEach(function(it){
        if(it.productoId){
          var prod = getProducto(it.productoId);
          if(prod && prod.precioCosto > 0){
            // CORREGIDO: ganancia por unidad vendida
            ganancia += (it.monto / it.cant) - prod.precioCosto;
          } else {
            ganancia += it.monto;
          }
        } else {
          ganancia += it.monto;
        }
      });
    } else if(v.productoId){
      var prod = getProducto(v.productoId);
      if(prod && prod.precioCosto > 0){
        ganancia += v.monto - (prod.precioCosto * v.cant);
      } else {
        ganancia += v.monto;
      }
    } else {
      ganancia += v.monto;
    }
  });
  (d.gastos || []).forEach(function(g){
    var esDePedido = g.pedidoId || (g.desc && g.desc.indexOf('Pedido:') === 0);
    if(!esDePedido) gastosTotal += g.monto;
  });
});
var gananciaNeta = ganancia - gastosTotal;
