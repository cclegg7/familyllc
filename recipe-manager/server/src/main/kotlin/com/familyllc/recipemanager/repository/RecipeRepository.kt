package com.familyllc.recipemanager.repository

import com.familyllc.recipemanager.entity.Recipe
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface RecipeRepository : JpaRepository<Recipe, Long> {
    
    fun findByTitleContainingIgnoreCase(title: String): List<Recipe>
    
    fun findByCategory(category: String): List<Recipe>
    
    @Query("SELECT r FROM Recipe r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    fun searchByTitleOrDescription(@Param("searchTerm") searchTerm: String): List<Recipe>
    
    fun findAllByOrderByTitleAsc(): List<Recipe>
    
    fun findAllByOrderByCategoryAsc(): List<Recipe>
    
    fun findAllByOrderByPrepTimeAsc(): List<Recipe>
    
    fun findAllByOrderByCreatedAtDesc(): List<Recipe>
}
