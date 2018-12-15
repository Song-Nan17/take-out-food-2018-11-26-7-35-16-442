function bestCharge(selectedItems) {
  let sameItemTotalPrice = computeSameItemTotalPrice(selectedItems);
  let totalPriceWithNoPromotion = computeTotalPriceWithNoPromotion(sameItemTotalPrice);
  let promotion = choosePromotion(sameItemTotalPrice, totalPriceWithNoPromotion);
  let totalPrice = computeTotalPrice(totalPriceWithNoPromotion, promotion);
  return printOrderList(sameItemTotalPrice, promotion, totalPrice);
}

function computeSameItemTotalPrice(selectedItems) {
  let selectedIdAndQuantity = getItemIdAndQuantity(selectedItems);
  let sameItemTotalPrice = selectedIdAndQuantity.map(function (selectedEle) {
    let selectedEleInfo = loadAllItems().find(function (ele) {
      if (ele.id === selectedEle.id) {
        return ele;
      }
    });
    selectedEle.name = selectedEleInfo.name;
    selectedEle.totalPrice = selectedEle.quantity * selectedEleInfo.price;
    return selectedEle;
  });
  return sameItemTotalPrice;
}

function getItemIdAndQuantity(selectedItems) {
  return selectedItems.map(function (ele) {
    let arr = ele.split(' x ');
    let obj = {};
    obj.id = arr[0];
    obj.quantity = Number(arr[1]);
    return obj;
  });
}

function computeTotalPriceWithNoPromotion(sameItemTotalPrice) {
  let totalPrice = sameItemTotalPrice.reduce(function (totalPrice, item) {
    return totalPrice + item.totalPrice;
  }, 0);
  return totalPrice;
}

function choosePromotion(sameItemTotalPrice, totalPriceWithNoPromotion) {
  let promotions = loadPromotions();
  let moneyOff = computeMoneyOff(totalPriceWithNoPromotion, promotions);
  let halfOff = computeHalfOff(sameItemTotalPrice, promotions);
  return comparePromotions(moneyOff, halfOff);
}

function computeMoneyOff(totalPrice, promotions) {
  let moneyOff = {};
  moneyOff.reduceMoney = 0;
  if (totalPrice >= 30) {
    moneyOff.type = promotions[0].type;
    moneyOff.reduceMoney = 6;
  }
  return moneyOff;
}

function computeHalfOff(sameItemTotalPrice, promotions) {
  let items = [];
  let reduceMoney = 0;
  let halfOff = sameItemTotalPrice.reduce(function (acc, item) {
    acc.type = promotions[1].type;
    if (promotions[1].items.includes(item.id)) {
      items.push(item.name);
      reduceMoney += item.totalPrice / 2;
    }
    acc.items = items;
    acc.reduceMoney = reduceMoney;
    return acc;
  }, {});
  return halfOff;
}

function comparePromotions(moneyOff, halfOff) {
  if (moneyOff.reduceMoney < halfOff.reduceMoney) {
    return halfOff;
  }
  return moneyOff;
}

function computeTotalPrice(price, promotion) {
  return price - promotion.reduceMoney;
}

function printOrderList(sameItemTotalPrice, promotion, totalPrice) {
  let itemsList = printItemsList(sameItemTotalPrice);
  let promotionList = printPromotionList(promotion);
  let totalPriceList = printTotalPriceList(totalPrice);
  return itemsList + '\n' + promotionList + '\n' + totalPriceList;
}

function printItemsList(sameItemTotalPrice) {
  let itemsArr = sameItemTotalPrice.reduce(function (acc, item) {
    let itemList = item.name + ' x ' + item.quantity + ' = ' + item.totalPrice + '元';
    acc.push(itemList);
    return acc;
  }, []);
  return '============= 订餐明细 =============\n' +
    itemsArr.join('\n');
}

function printPromotionList(promotion) {
  if (promotion.reduceMoney === 0) {
    return '-----------------------------------';
  } else if (promotion.type === '满30减6元') {
    return '-----------------------------------\n' +
      '使用优惠:\n' +
      '满30减6元，省6元\n' +
      '-----------------------------------';
  } else if (promotion.type === '指定菜品半价') {
    return '-----------------------------------\n' +
      '使用优惠:\n' +
      '指定菜品半价(' + promotion.items.join('，') + ')，省' + promotion.reduceMoney + '元\n' +
      '-----------------------------------';
  }
}

function printTotalPriceList(totalPrice) {
  return '总计：' + totalPrice + '元\n' +
    '===================================';
}