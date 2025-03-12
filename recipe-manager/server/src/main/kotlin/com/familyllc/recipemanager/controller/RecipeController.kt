package com.familyllc.recipemanager.controller

import com.familyllc.recipemanager.dto.RecipeCreateDto
import com.familyllc.recipemanager.dto.RecipeDto
import com.familyllc.recipemanager.dto.RecipeUpdateDto
import com.familyllc.recipemanager.service.RecipeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/recipes")
@CrossOrigin(origins = ["http://localhost:3000"])
class RecipeController(private val recipeService: RecipeService) {

    @GetMapping
    fun getAllRecipes(
        @RequestParam(required = false) search: String?,
        @RequestParam(required = false) category: String?,
        @RequestParam(required = false) sortBy: String?
    ): ResponseEntity<List<RecipeDto>> {
        val recipes = when {
            !search.isNullOrBlank() -> recipeService.searchRecipes(search)
            !category.isNullOrBlank() -> recipeService.getRecipesByCategory(category)
            !sortBy.isNullOrBlank() -> recipeService.getSortedRecipes(sortBy)
            else -> recipeService.getAllRecipes()
        }
        return ResponseEntity.ok(recipes)
    }

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable id: Long): ResponseEntity<RecipeDto> {
        val recipe = recipeService.getRecipeById(id)
        return ResponseEntity.ok(recipe)
    }

    @PostMapping
    fun createRecipe(@RequestBody recipeCreateDto: RecipeCreateDto): ResponseEntity<RecipeDto> {
        val createdRecipe = recipeService.createRecipe(recipeCreateDto)
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRecipe)
    }

    @PutMapping("/{id}")
    fun updateRecipe(
        @PathVariable id: Long,
        @RequestBody recipeUpdateDto: RecipeUpdateDto
    ): ResponseEntity<RecipeDto> {
        val updatedRecipe = recipeService.updateRecipe(id, recipeUpdateDto)
        return ResponseEntity.ok(updatedRecipe)
    }

    @DeleteMapping("/{id}")
    fun deleteRecipe(@PathVariable id: Long): ResponseEntity<Void> {
        recipeService.deleteRecipe(id)
        return ResponseEntity.noContent().build()
    }
}
