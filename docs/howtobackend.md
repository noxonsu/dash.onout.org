## How we store settings in the past
In the classic model, every app has a frontend and backend. Previously, our apps work on WordPress, and we use WordPress database to store settings. For example:

Frontend in admin dashboard:
```php
<?php 
if ($_POST['logo_url']) update_option("logo_url",$_POST['logo_url'])
?>
<form>
<input type='' name='logo_url' value='<?php get_option("logo_url"); ?>'>
<input type='submit' value='Save'>
</form>
```

Code in frontend to load "logo_url" setting from backend to the app. 
```html
<script>
window.logoUrl='<?php get_option("logo_url");  ?>'
</script>
<script scr='app.js'></script> <!-- app.js contains react.js app which can use "logoUrl" variable to display logo in proper place. 
```

We use WordPress, but this way is not secure.

## How we store settings now
We don't trust backend by default, and now we use blockchain as our database in this way. We have deployed a Storage contract. 
https://bscscan.com/address/0x4B2B549d0Be6013f30221f23d0165587cAc3f888#code=

This is simple key-value storage. 

Plain JS example. Dashboard:
```js
var keyname = window.location.domain+"logo_url"; //the name of variable to call from storage.
<input type='logo_url' id='logo_url' value=''>
<input type='button' onclick='save()' value='Save'>
<Script>
document.getElementById("logo_url").value = web3.contractAt(0x4B2B549d0Be6013f30221f23d0165587cAc3f888).getData(keyname); 

function save() {
  web3.contractAt(0x4B2B549d0Be6013f30221f23d0165587cAc3f888).setKeyData(keyname,document.getElementById("logo_url").value); 
}
</script>
```

And on a client's frontend in the app, just replace the line with getter function:
```html
<script>
window.logoUrl=web3.contractAt(0x4B2B549d0Be6013f30221f23d0165587cAc3f888).getData(keyname); 
</script>
<script scr='app.js'></script> <!-- app.js contains react.js app which can use "logoUrl" variable to display logo in proper place. 
```

# FAQ
Q: Can you change the data?
A: No, we can't. Only who defined variable can change it. Also, we save your address as "domain admin" and no one can edit variables which name starts from your domain name

Q: Do I need to create TX for every variable?
A: You can use arrays and JSON to store structured data. 

Q: if I forgot to define a variable on my domain, can someone do this?
A: No, we save your address 
