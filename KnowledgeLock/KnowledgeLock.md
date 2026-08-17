# Obsidian KnowledgeLock Plugin

This plugin is meant to encrypt and decrypt information for users in Obsidian

#### Terminology
Modules = snippets of information (can be any type of information such as, text, an image or a link)
DM = Master user creating the config file
Player = Users that decrypt the config file
Vault = an Obsidian Vault

#### Requirements
- File needs to be readable at a glance (json) and should be GUI editable within an Obsidian vault.
- Modules need to be encrypted by the DM.
- Modules outputs should be displayed within the plugin instance, not an external link to a file (Output can be a link, but it should not be a link to another output).
- Each file needs to have the ability to have decryption applied to JUST that one file so that way you aren't processing the entire vault every time.
- Plugin should be reencryptable (at a single file level) so that way you can re-encrypt data you've unlocked (forgetting)
- Needs to be accessible by each player and store their modules.
	- Obsidian Plugin
- Needs to be a one time setup, so that way both the Player and DM can have ease of use.
	- Single config File containing all information
- Needs to have a graphical interface for creating & editing modules
	- Graphical Creator that can append to a configuration file (json)
- Needs to have multiple keys that can dynamically unlock multiple and different modules
	- DM can ship with multiple encoded keys that each can work ("password" dynamically loads the content)
- Needs to be able to have ONE file for the entire party that still maintains usage for all (Regardless of class).
- Make it document type agnostic with regeneration for .md files.
- Needs to be Vault Agnostic
	- Datacore (data should be extendable)
- Files that modules are in need to remain editable in Obsidian (stay in .md) and should be easily query-able.

#### Possible Solutions
- Creating multiple files for the same thing, and giving a player access to that information
- Password locking information
- DM only having access to knowledge and marking it according to which classes would have that information. (Knowledge Domains)

Knowledge Domains are an area that would be researched and have 3 tiers of depth. Tier One is information anyone would know, Tier Two is information only well-researched people would know, Tier Three is specific information that people specialized in that field would know (Usually "holy grail" information/lore/fun facts)