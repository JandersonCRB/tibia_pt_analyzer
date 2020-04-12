import calculateValuePerHour from "../helpers/calculateValuePerHour";

export default class PartyData {
  constructor({ time, lootType, loot, supplies, balance, chars } = {}) {
    this.time = time;
    this.lootType = lootType;
    this.loot = loot;
    this.supplies = supplies;
    this.balance = balance;
    if (loot - supplies !== balance) {
      throw new Error("Balance differs from loot minus supplies calc");
    }
    this.lootPerHour = calculateValuePerHour(loot, time);
    this.suppliesPerHour = calculateValuePerHour(supplies, time);
    this.balancePerHour = calculateValuePerHour(balance, time);
    this.chars = chars.map((char) => {
      char.damagePerHour = calculateValuePerHour(char.damage, time);
      char.healingPerHour = calculateValuePerHour(char.healing, time);
      return char;
    });
    const charBalanceSum = chars.reduce((sum, char) => sum + char.balance, 0);
    if (balance !== charBalanceSum) {
      throw new Error("Characters balance sum differs from balance");
    }
    const balanceGoal = balance / chars.length;
    chars.forEach((char) => (char.missingBalance = char.balance - balanceGoal));
    for (let i = 0; i < 10; i++) {
      let notBalanced = false;
      chars.forEach((char) => {
        if (char.missingBalance > 5) {
          notBalanced = true;
        }
      });
      if (!notBalanced) {
        break;
      }
      const max = chars.sort(
        (c1, c2) => c2.missingBalance - c1.missingBalance
      )[0];
      const min = chars.sort(
        (c1, c2) => c1.missingBalance - c2.missingBalance
      )[0];
      let transferable = Math.min(Math.abs(min.missingBalance), max.missingBalance);
      transferable = Math.abs(transferable);
      // console.log(min.name + " missingBalance: " + min.missingBalance);
      // console.log(max.name + " missingBalance: " + max.missingBalance);
      if (transferable !== 0) {
        max.addTransfer("give", transferable, min);
        min.addTransfer("receive", transferable, max);
        console.log(max.name + " transfers " + transferable + " to " + min.name)
      }

      // console.log(max, min)
    }
  }
}
