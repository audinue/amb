<script src="script.php"></script>

<div data-component="say-hello">
  Hello <span data-text="name"></span>!
</div>

<div data-foreach="[1, 2, 3]">
  <div data-is="say-hello" data-prop="name: 'John Doe'"></div>
</div>

<script>
binding.bind()
</script>