





  runCalculation(index: number, qty: any, event: any, atlas: any) {
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.productData[index]
        let atlasId = curr.atlas_id
        let spec = curr.spec_data
        curr.qty = qty

        if (!this.allAddedItemAtlasID.includes(atlasId)) {
          this.allAddedItemAtlasID.push(atlasId)
        }

        if (spec !== null) {
          if (spec.length > 0) {
            for (let j = 0; j < spec.length; j++) {
              const f = spec[j]
              if (f.type == 'assorted') {
                curr.quantity = qty
                curr.pos = index
                this.assortFilter.push(curr)
                for (let y = 0; y < this.assortFilter.length; y++) {
                  const t = this.assortFilter[y]
                  if (t.id == curr.id) {
                  } else {
                    this.assortFilter.push(curr)
                  }

                  this.newArrayFilter = this.assortFilter.filter(
                    (x: any, y: any) => this.assortFilter.indexOf(x) == y,
                  )

                  let secondPhase: any = []
                  let anotherFilter: any = []
                  let letsContinue = false

                  for (let h = 0; h < this.newArrayFilter.length; h++) {
                    const e = this.newArrayFilter[h]
                    if (e.grouping == curr.grouping) {
                      if (e.spec_data.length > 0) {
                        letsContinue = true
                        //console.log(e.spec_data);
                        // e.spec_data[h].quantity = e.quantity;
                        // e.spec_data[h].pos = e.pos;
                        // e.spec_data[0].arrIndex = e.spec_data.length - 1;
                        // secondPhase.push(e.spec_data[0]);

                        e.spec_data.pos = e.pos
                        e.spec_data.quantity = e.quantity
                        e.spec_data.atlas_id = e.atlas_id
                        e.spec_data.group = e.grouping

                        for (let t = 0; t < e.spec_data.length; t++) {
                          let ele = e.spec_data[t]
                          ele.quantity = e.quantity
                          ele.pos = e.pos
                          ele.atlas_id = e.atlas_id
                          ele.arrIndex = t
                          secondPhase.push(ele)
                        }
                        this.anotherLinePhase.push(e.spec_data)
                      } else {
                        let price = parseFloat(e.booking)
                        let quantity = parseInt(e.quantity)
                        let newPrice = price * quantity
                        let formattedAmt = this.currencyPipe.transform(
                          newPrice,
                          '$',
                        )

                        // for (let t = 0; t < this.productData.length; t++) {
                        //   const tt = this.productData[t]
                        //   if (tt.atlas_id == atlas) {
                        //     tt.price = formattedAmt
                        //     tt.qty = qty
                        //   }
                        // }

                        // for (let a = 0; a < this.productData.length; a++) {
                        //   const element = this.productData[a];
                        //   if(element.atlas_id == ele.atlas_id){
                        //     element.price = newPrice
                        //   }

                        // }

                        // this.productData[e.atlas_id].price = formattedAmt
                        // this.productData[e.atlas_id].calPrice = newPrice

                        $('#u-price-' + e.pos).html(price)
                        $('#amt-' + e.pos).html(formattedAmt)
                        $('#amt-hidd-' + e.pos).html(newPrice)
                      }
                    } else {
                    }
                  }

                  this.anotherLinePhaseFilter = this.anotherLinePhase.filter(
                    (v: any, i: any, a: any) =>
                      a.findIndex((t: any) => t.atlas_id === v.atlas_id) === i,
                  )

                  let newTotalAss = 0

                  this.anotherLinePhaseFilter.map((val: any, index: any) => {
                    if (curr.grouping == val.group) {
                      console.log(curr.grouping)
                      newTotalAss += parseInt(val.quantity)
                    }
                  })

                  /// console.log(newTotalAss, 'Total');

                  if (letsContinue) {
                    let status = false
                    for (
                      let h = 0;
                      h < this.anotherLinePhaseFilter.length;
                      h++
                    ) {
                      const k = this.anotherLinePhaseFilter[h]
                      if (newTotalAss >= parseInt(k[0].cond)) {
                        status = true

                        $('.normal-booking-' + k.pos).css('display', 'none')
                      } else {
                        for (let hj = 0; hj < k.length; hj++) {
                          const eleK = k[hj]
                          $(
                            '.special-booking-' +
                              eleK.pos +
                              '-' +
                              eleK.arrIndex,
                          ).css('display', 'none')

                          let booking = parseFloat(eleK.booking)
                          let newPrice = parseInt(eleK.quantity) * booking
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$',
                          )

                          // for (let t = 0; t < this.productData.length; t++) {
                          //   const tt = this.productData[t]
                          //   if (tt.atlas_id == atlas) {
                          //     tt.price = formattedAmt
                          //     tt.qty = qty

                          //   }
                          // }

                          ///this.productData[eleK.pos].calPrice = newPrice
                          ///this.productData[eleK.pos].price = formattedAmt

                          $('#u-price-' + eleK.pos).html(booking)
                          $('#amt-' + eleK.pos).html(formattedAmt)
                          $('#amt-hidd-' + eleK.pos).html(newPrice)
                        }

                        let price = parseFloat(k.booking)
                        $('.normal-booking-' + k.pos).css(
                          'display',
                          'inline-block',
                        )
                      }
                    }

                    if (status) {
                      let tickArrToBeRemoved = []
                      //// If total Assorted is greater than condition /////
                      for (
                        let i = 0;
                        i < this.anotherLinePhaseFilter.length;
                        i++
                      ) {
                        const jk = this.anotherLinePhaseFilter[i]
                        let currArrLength = jk.length

                        for (let j = 0; j < jk.length; j++) {
                          --currArrLength
                          const backWard = jk[currArrLength]
                          const frontWard = jk[j]

                          if (
                            newTotalAss < backWard.cond &&
                            newTotalAss >= frontWard.cond
                          ) {
                            let nxt = frontWard.arrIndex + 1
                            let preData = jk[nxt]
                            let activeData = frontWard

                            $('.normal-booking-' + activeData.pos).css(
                              'display',
                              'none',
                            )

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex,
                            ).css('display', 'inline-block')

                            $(
                              '.special-booking-' +
                                preData.pos +
                                '-' +
                                preData.arrIndex,
                            ).css('display', 'none')
                            let special = parseFloat(activeData.special)
                            let newPrice =
                              parseInt(activeData.quantity) * special
                            let formattedAmt = this.currencyPipe.transform(
                              newPrice,
                              '$',
                            )

                            // this.productData[
                            //   activeData.pos
                            // ].price = formattedAmt

                            // this.productData[activeData.pos].calPrice = newPrice

                            // for (let t = 0; t < this.productData.length; t++) {
                            //   const tt = this.productData[t]
                            //   if (tt.atlas_id == atlas) {
                            //     tt.price = formattedAmt
                            //     tt.qty = qty
                            //   }
                            // }

                            $('#u-price-' + activeData.pos).html(special)
                            $('#amt-' + activeData.pos).html(formattedAmt)
                            $('#amt-hidd-' + activeData.pos).html(newPrice)
                          } else {
                            let pre = backWard.arrIndex - 1
                            let preData = jk[pre]
                            let activeData = backWard
                            let chNxt = pre + 1
                            let chpp = jk[chNxt]

                            // console.log('dropped', activeData);
                            let pp = jk[j]

                            if (newTotalAss >= pp.cond) {
                              let special = parseFloat(pp.special)
                              let newPrice = parseInt(pp.quantity) * special
                              let formattedAmt = this.currencyPipe.transform(
                                newPrice,
                                '$',
                              )

                              for (
                                let t = 0;
                                t < this.productData.length;
                                t++
                              ) {
                                const tt = this.productData[t]
                                if (tt.atlas_id == atlas) {
                                  tt.price = formattedAmt
                                }
                              }

                              // this.productData[pp.pos].calPrice = newPrice
                              // this.productData[pp.pos].price = formattedAmt

                              $('#u-price-' + pp.pos).html(special)
                              $('#amt-' + pp.pos).html(formattedAmt)
                              $('#amt-hidd-' + pp.pos).html(newPrice)
                            }

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex,
                            ).css('display', 'inline-block')

                            if (preData != undefined) {
                              tickArrToBeRemoved.push(preData)
                            }
                            for (
                              let hi = 0;
                              hi < tickArrToBeRemoved.length;
                              hi++
                            ) {
                              const kk = tickArrToBeRemoved[hi]
                              $(
                                '.special-booking-' +
                                  kk.pos +
                                  '-' +
                                  kk.arrIndex,
                              ).css('display', 'none')
                            }

                            // console.log(tickArrToBeRemoved);
                          }
                        }
                      }
                    } else {
                      /// if total Assorted is not greater than condition /////
                    }
                  }
                }
              } else {
                ///////// Speacial Price ////////
                let arr = this.extendField.toArray()[index]
                let specialAmt = 0
                let specialCond = 0
                let specData = this.productData[index].spec_data
                this.normalPrice = parseFloat(this.productData[index].booking)
                for (let i = 0; i < specData.length; i++) {
                  let curAmt = parseFloat(specData[i].special)
                  let cond = parseInt(specData[i].cond)
                  let orignialAmt = parseFloat(specData[i].booking)
                  specData[i].arrIndex = i
                  let nextArr = i + 1
                  let len = specData.length

                  if (qty >= cond) {
                    this.normalPrice = curAmt
                    $('.normal-booking-' + index).css('display', 'none')

                    $(
                      '.special-booking-' + index + '-' + specData[i].arrIndex,
                    ).css('display', 'inline-block')

                    let g = i - 1
                    let nxt = i + 1

                    if (specData[nxt]) {
                      $('.special-booking-' + index + '-' + nxt).css(
                        'display',
                        'none',
                      )
                    } else {
                    }

                    $('.special-booking-' + index + '-' + g).css(
                      'display',
                      'none',
                    )
                  } else {
                    this.normalPrice = this.normalPrice
                    $('.special-booking-' + index + '-' + i).css(
                      'display',
                      'none',
                    )
                    let nxt = i + 1
                    let pre = i - 1

                    if (specData[nxt]) {
                      let cond = specData[nxt].cond
                      if (qty < cond) {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block',
                        )
                      } else {
                        $('.normal-booking-' + index).css('display', 'none')
                      }
                      $('.normal-booking-' + index).css('display', 'none')
                    } else {
                      // console.log(specData[pre]);
                      let preData = specData[pre]
                      if (preData) {
                        let preCond = parseInt(preData.cond)
                        // console.log(`${preCond} and ${qty}`);
                        if (qty >= preCond) {
                          $('.normal-booking-' + index).css('display', 'none')
                        } else {
                        }
                      } else {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block',
                        )
                      }

                      if (qty >= cond) {
                        $('.normal-booking-' + index).css('display', 'none')
                      } else {
                      }
                    }
                  }

                  if (qty >= cond) {
                    this.normalPrice = curAmt
                  } else {
                    this.normalPrice = this.normalPrice
                  }
                }

                let calAmt = qty * this.normalPrice
                this.currentProductAmt = calAmt
                $('#u-price-' + index).html(this.normalPrice)
                let formattedAmt = this.currencyPipe.transform(calAmt, '$')
                arr.nativeElement.innerHTML = formattedAmt

                // this.productData[index].price = formattedAmt
                // this.productData[index].calPrice = calAmt

                // for (let t = 0; t < this.productData.length; t++) {
                //   const tt = this.productData[t]
                //   if (tt.atlas_id == atlas) {
                //     tt.price = formattedAmt
                //   }
                // }

                $('#amt-' + index).html(formattedAmt)
                $('#amt-hidd-' + index).html(calAmt)
              }
            }
          } else {
            let quantity = parseInt(qty)
            let price = parseFloat(curr.booking)

            let calAmt = quantity * price
            this.currentProductAmt = calAmt

            ///console.log(price, 'unit Price');
            $('#u-price-' + index).html(price)

            $('.normal-booking-' + index).css('display', 'inline-block')

            let formattedAmt = this.currencyPipe.transform(calAmt, '$')

            // this.productData[index].price = formattedAmt
            // this.productData[index].calPrice = calAmt

            // for (let t = 0; t < this.productData.length; t++) {
            //   const tt = this.productData[t]
            //   if (tt.atlas_id == atlas) {
            //     tt.price = formattedAmt
            //   }
            // }

            $('#amt-' + index).html(formattedAmt)
            $('#amt-hidd-' + index).html(calAmt)
          }
        } else {
          console.log('trying to find it')
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.currentProductAmt = calAmt

          $('#u-price-' + index).html(price)
          $('#amt-hidd-' + index).html(calAmt)
          $('.normal-booking-' + index).css('display', 'inline-block')
          let formattedAmt = this.currencyPipe.transform(calAmt, '$')

          // this.productData[index].price = formattedAmt
          // this.productData[index].calPrice = calAmt

          // for (let t = 0; t < this.productData.length; t++) {
          //   const tt = this.productData[t]
          //   if (tt.atlas_id == atlas) {
          //     tt.price = formattedAmt
          //   }
          // }

          $('#amt-' + index).html(formattedAmt)
        }
      } else {
        if (qty == '' || qty == 0) {
          for (let h = 0; h < this.assortFilter.length; h++) {
            let ele = this.assortFilter[h]
            let curr = this.productData[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.assortFilter.indexOf(ele)
              if (index >= 0) {
                this.assortFilter.splice(index, 1)
              }
            }
          }

          for (let h = 0; h < this.newArrayFilter.length; h++) {
            let ele = this.newArrayFilter[h]
            let curr = this.productData[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.newArrayFilter.indexOf(ele)
              if (index >= 0) {
                this.newArrayFilter.splice(index, 1)
              }
              this.assortFilter = this.newArrayFilter
            }
          }

          // console.log(this.anotherLinePhaseFilter, 'tersting another line')

          for (let hy = 0; hy < this.anotherLinePhaseFilter.length; hy++) {
            let he = this.anotherLinePhaseFilter[hy]
            let curr = this.productData[index]
            if (curr.atlas_id == he.atlas_id) {
              const ind = this.anotherLinePhaseFilter.indexOf(he)
              if (ind >= 0) {
                this.anotherLinePhaseFilter.splice(ind, 1)
              }
              this.anotherLinePhase = []
              this.anotherLinePhase = this.anotherLinePhaseFilter
            }
          }

          // console.log(this.anotherLinePhase, 'tersting another line')

          let checkTotalAss = 0
          let curr = this.productData[index]

          this.anotherLinePhase.map((val: any, index: any) => {
            if (curr.grouping == val.group) {
              checkTotalAss += parseInt(val.quantity)
            }
          })

          // console.log(checkTotalAss)

          for (let tk = 0; tk < this.anotherLinePhase.length; tk++) {
            let jk = this.anotherLinePhase[tk]
            let tickArrToBeRemoved = []
            // const jk = this.anotherLinePhaseFilter[i];
            let currArrLength = jk.length

            if (curr.grouping == jk.group) {
              if (jk.length > 1) {
                for (let kl = 0; kl < jk.length; kl++) {
                  const kelly = jk[kl]
                  --currArrLength
                  const backWard = jk[currArrLength]
                  const frontWard = jk[kl]

                  if (
                    checkTotalAss < backWard.cond &&
                    checkTotalAss >= frontWard.cond
                  ) {
                    let nxt = frontWard.arrIndex + 1
                    let preData = jk[nxt]
                    let activeData = frontWard

                    $('.normal-booking-' + activeData.pos).css(
                      'display',
                      'none',
                    )

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex,
                    ).css('display', 'inline-block')

                    $(
                      '.special-booking-' +
                        preData.pos +
                        '-' +
                        preData.arrIndex,
                    ).css('display', 'none')

                    let special = activeData.special
                    let newPrice = parseInt(activeData.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    // this.productData[activeData.pos].price = formattedAmt
                    // this.productData[activeData.pos].calPrice = newPrice

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    $('#u-price-' + activeData.pos).html(special)
                    $('#amt-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-' + activeData.pos).html(newPrice)
                  } else {
                    let pre = backWard.arrIndex - 1
                    let preData = jk[pre]
                    let activeData = backWard

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex,
                    ).css('display', 'inline-block')

                    let special = activeData.special
                    let newPrice = parseInt(activeData.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    // this.productData[activeData.pos].price = formattedAmt
                    // this.productData[activeData.pos].calPrice = newPrice

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    $('#u-price-' + activeData.pos).html(special)
                    $('#amt-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-' + activeData.pos).html(newPrice)

                    /// console.log(activeData, 'we testing it here, innsed')

                    if (checkTotalAss >= activeData.cond) {
                    } else {
                      if (preData != undefined) {
                        tickArrToBeRemoved.push(activeData)
                      }
                      $('.normal-booking-' + activeData.pos).css(
                        'display',
                        'inline-block',
                      )

                      let booking = activeData.booking
                      let newPrice = parseInt(activeData.quantity) * booking
                      let formattedAmt = this.currencyPipe.transform(
                        newPrice,
                        '$',
                      )

                      // for (let t = 0; t < this.productData.length; t++) {
                      //   const tt = this.productData[t]
                      //   if (tt.atlas_id == atlas) {
                      //     tt.price = formattedAmt
                      //   }
                      // }

                      // this.productData[activeData.pos].price = formattedAmt
                      // this.productData[activeData.pos].calPrice = newPrice

                      $('#u-price-' + activeData.pos).html(booking)
                      $('#amt-' + activeData.pos).html(formattedAmt)
                      $('#amt-hidd-' + activeData.pos).html(newPrice)
                    }

                    if (preData != undefined) {
                      tickArrToBeRemoved.push(preData)
                    }
                    for (let hi = 0; hi < tickArrToBeRemoved.length; hi++) {
                      const kk = tickArrToBeRemoved[hi]
                      $('.special-booking-' + kk.pos + '-' + kk.arrIndex).css(
                        'display',
                        'none',
                      )
                    }
                  }
                }
              } else {
                for (let ag = 0; ag < jk.length; ag++) {
                  const agaa = jk[ag]

                  if (checkTotalAss >= agaa.cond) {
                    $('.normal-booking-' + agaa.pos).css('display', 'none')

                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'inline-block',
                    )
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    // this.productData[agaa.pos].price = formattedAmt
                    // this.productData[agaa.pos].calPrice = newPrice

                    $('#u-price-' + agaa.pos).html(special)
                    $('#amt-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-' + agaa.pos).html(newPrice)
                  } else {
                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'none',
                    )
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    // this.productData[agaa.pos].price = formattedAmt
                    // this.productData[agaa.pos].calPrice = newPrice

                    $('#u-price-' + agaa.pos).html(special)
                    $('#amt-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-' + agaa.pos).html(newPrice)
                  }
                }
              }
            }
          }
        }

        /// qty = 0;
        let curr = this.productData[index]
        let spec = curr.spec_data

        $('.normal-booking-' + index).css('display', 'none')
        if (spec != null) {
          for (let h = 0; h < spec.length; h++) {
            $('.special-booking-' + index + '-' + h).css('display', 'none')
          }
        }

        // this.productData[index].price = '$0.00'
        // this.productData[index].calPrice = 0

        // for (let t = 0; t < this.productData.length; t++) {
        //   const tt = this.productData[t]
        //   if (tt.atlas_id == atlas) {
        //     tt.price = '$0.00'
        //   }
        // }

        let formattedAmt = this.currencyPipe.transform(0, '$')
        $('#amt-' + index).html(formattedAmt)
        $('#amt-hidd-' + index).html(0)
      }
    }

    this.runTotalCalculation(index)
  }

