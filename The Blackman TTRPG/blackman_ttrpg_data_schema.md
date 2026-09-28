Data should be extendable modules based with additions possible at any time. 

Types of Modules:
- Items
- Currency
- Loot Pool (Includes Items, Optional Abilities)
- Abilities
- Roll Modifiers
- Value Modifiers

Functionality:
- Replace text/abilities
- Add onto text/abilities
- Modify attributes
- Add attributes
- Manual Refreshes (Automatic turned off by default)
- Add functions?
- Replacement order
- GUI for setup

```
module_array {
	 {
		num ID: ;
		string module_name: ;
		string module_identifier: ; 
		number module_description: ; 
		number module_ATTR_1 (number): ; 
		number module_ATTR_2 (number): ;
		number module_ATTR_3 (number): ;
		bool module_isability (bool): ;
	}
}
```
